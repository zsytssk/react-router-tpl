import { Spin } from 'antd';
import { Navigate } from 'react-router';

import { useUserStore } from '@/store/user';

export default function Page() {
  const { token, initLoading } = useUserStore();
  if (initLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin spinning size="large"></Spin>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/overview" replace />;
  }
  return <Navigate to="/login" replace />;
}
