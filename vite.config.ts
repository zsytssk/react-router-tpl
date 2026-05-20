import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type PluginOption } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

import svgr from 'vite-plugin-svgr';

import WaPosition from './scripts/waPosition';
import WaPositionServer from './scripts/waPositionServer';
import { execSync } from 'child_process';

const gitTime = execSync('git log -1 --format=%cd --date=format:"%Y.%m.%d"')
  .toString()
  .trim();
let gitVersion = execSync('git rev-parse --short HEAD').toString().trim();
const gitLocalChange = execSync('git status -s').toString().trim();
if (gitLocalChange) {
  gitVersion = gitVersion + '*';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      __APP_BUILD_TIME__: JSON.stringify(gitTime),
      __APP_VERSION__: JSON.stringify(gitVersion),
    },
    plugins: [
      env.VITE_POSITION === 'open' && WaPositionServer(),
      env.VITE_POSITION === 'open' && WaPosition(),
      tailwindcss(),
      reactRouter(),
      svgr({
        svgrOptions: {
          // 配置选项（可选）
          dimensions: false, // 移除宽度和高度属性
          icon: true, // 将SVG视为图标（添加默认尺寸）
        },
      }),
      {
        ...devtoolsJson(),
        apply: 'serve',
      },
    ].filter(Boolean) as PluginOption[],
    server: {
      host: '0.0.0.0',
      // 如果使用docker-compose开发模式，设置为false
      open: false,
      port: env.VITE_CLI_PORT as any,
      proxy: {
        // 把key的路径代理到target位置
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [env.VITE_BASE_API as string]: {
          // 需要代理的路径   例如 '/api'
          // target: `${env.VITE_BASE_PATH}/api`, // 代理到 目标路径
          target: env.VITE_REMOTE_BASE_PATH
            ? env.VITE_REMOTE_BASE_PATH
            : `${env.VITE_BASE_PATH}:${env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: false,
          rewrite: (path) => {
            return path.replace(new RegExp('^' + env.VITE_BASE_API), '');
          },
        },
        [env.VITE_PREVIEW_API as string]: {
          target: `${env.VITE_PREVIEW_PATH}:${env.VITE_PREVIEW_PORT}/`, // 代理到 目标路径
          changeOrigin: false,
          // rewrite: path => path.replace(new RegExp('^' + process.env.VITE_PREVIEW_API), ''),
        },
      },
    },
  };
});
