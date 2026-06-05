import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, App as AppAntd } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import cookie from 'js-cookie';
import React, { useLayoutEffect } from 'react';
import 'dayjs/locale/zh-cn';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import { cn } from './lib/utils';
import { useThemeMode } from './store/theme-mode';
import { useUserStore } from './store/user';
import { initDom } from './utils/positionToCode';
import './styles/app.css';

dayjs.extend(duration);

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // 全局设置查询失败时的重试次数
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // 可单独配置 mutation 的重试策略
    },
  },
});

if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  if (token) {
    localStorage.setItem('token', token);
    cookie.set('x-token', token);
    url.searchParams.delete('token');
    window.history.replaceState({}, '', url);
  }
  useUserStore.getState().init();
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeMode();
  useLayoutEffect(() => {
    initDom();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body className={cn({ 'dark bg-background': isDark })}>
        <StyleProvider>
          <ConfigProvider
            locale={zhCN}
            theme={{
              components: {
                Segmented: {
                  itemSelectedColor: '#0A60FF',
                },
                Button: {
                  primaryColor:
                    'linear-gradient(90deg, #1094FF 0%, #0A60FF 100%)',
                  defaultHoverBg:
                    'linear-gradient(90deg, #4389FF 0%, #0A60FF 100%)',
                  defaultHoverColor:
                    'linear-gradient(90deg, #4389FF 0%, #0A60FF 100%)',
                },
                Select: {
                  optionSelectedBg: '#EBF1FF',
                },
                Tree: {
                  paddingXS: 16,
                },
                Table: {
                  rowHoverBg: '#F0F0F0',
                },
              },
            }}
            input={{
              autoComplete: 'off',
            }}
          >
            <AppAntd>
              <QueryClientProvider client={queryClient}>
                {import.meta.env.VITE_SHOW_TANSTACK_DEVTOOL === '1' ? (
                  <ReactQueryDevtools buttonPosition="bottom-left" />
                ) : undefined}

                {children}
              </QueryClientProvider>
            </AppAntd>
          </ConfigProvider>
        </StyleProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
