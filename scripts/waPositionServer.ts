import child_process from 'child_process';
import os from 'os';

export default function WaPositionServer() {
  return {
    name: 'wa-position-server',
    apply: 'serve',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req._parsedUrl.pathname !== '/waPositionCode') {
          next();
          return;
        }
        const path = req._parsedUrl.query && req._parsedUrl.query.split('=')[1];
        if (path && path !== 'null') {
          if (process.env.VITE_EDITOR === 'webstorm') {
            const lastColonIndex = path.lastIndexOf(':');
            const linePath = path.substring(lastColonIndex + 1);
            const filePath = path.substring(0, lastColonIndex);
            const platform = os.platform();
            if (platform === 'win32') {
              child_process.exec(
                `webstorm64.exe  --line ${linePath} ${filePath}`
              );
            } else {
              child_process.exec(`webstorm --line ${linePath} ${filePath}`);
            }
          } else {
            child_process.exec('code -r -g ' + path);
          }
        }
        res.statusCode = 200;
        res.end('ok');
      });
    },
  };
}
