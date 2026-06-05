import { Spin } from 'antd';
import { useMemo } from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router';

import { useUserStore } from '@/store/user';

import LoginLayout from './components/LoginLayout';

export default function Page() {
  const { token, initLoading } = useUserStore();
  const [searchParams] = useSearchParams();

  const isLite = useMemo(() => {
    return searchParams.get('layout') === 'lite';
  }, [searchParams]);

  if (initLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin spinning size="large"></Spin>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLite) {
    return (
      <div className="w-screen h-screen flex flex-col">
        <Outlet />
      </div>
    );
  }

  return (
    <LoginLayout>
      <Outlet />
    </LoginLayout>
  );
}
