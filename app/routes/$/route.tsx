import { useCallback, useMemo } from 'react';
import Effect404 from './components/404Effects';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Spin } from 'antd';

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
