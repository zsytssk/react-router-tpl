import { Spin } from 'antd';
import { motion } from 'motion/react';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { useUserStore } from '@/store/user';

import Effect404 from './components/404Effects';

export default function NotFound() {
  const { initLoading, token } = useUserStore();
  const navigate = useNavigate();

  const gotoValidPage = useCallback(() => {
    if (token) {
      navigate('/overview');
    } else {
      navigate('/login');
    }
  }, [navigate, token]);

  if (initLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin spinning size="large"></Spin>
      </div>
    );
  }

  return <div>404</div>;
}
