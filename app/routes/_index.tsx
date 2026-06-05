import { Spin } from 'antd';
import { Navigate } from 'react-router';

import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user';

export default function Page() {
  const { token, initLoading } = useUserStore();
  if (initLoading) {
    return (
      <div className={cn('flex h-screen w-screen items-center justify-center')}>
        <Spin spinning size="large"></Spin>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/overview" replace />;
  }
  return <Navigate to="/login" replace />;
}
