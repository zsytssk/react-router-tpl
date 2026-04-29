import { useCallback, useMemo } from 'react';
import Effect404 from './components/404Effects';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import UnLoginLayout from '../login/components/UnLoginLayout';
import LoginLayout from '../_layout/components/LoginLayout';
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

  const LocalLayout = useMemo(() => {
    if (!token) {
      return UnLoginLayout;
    }
    return LoginLayout;
  }, [token]);

  if (initLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin spinning size="large"></Spin>
      </div>
    );
  }

  return (
    <LocalLayout>
      <div className="flex w-full relative z-10 flex-1 items-center justify-center">
        <div className="h-full w-full flex items-center">
          <Effect404>
            <div className="mt-4">
              <motion.button
                type="submit"
                onClick={gotoValidPage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative w-[120px] rounded-2xl overflow-hidden text-white transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 20,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg,#06b6d4,#3b82f6,#6366f1)',
                  boxShadow:
                    '0 0 28px rgba(34,211,238,0.32),0 8px 22px rgba(59,130,246,0.32)',
                }}
              >
                {token ? '返回首页' : '登录'}
              </motion.button>
            </div>
          </Effect404>
        </div>

        {/* Vertical divider */}
        <div
          className="flex-shrink-0"
          style={{
            width: 1,
            margin: '40px 0',
            background:
              'linear-gradient(180deg,transparent 3%,rgba(34,211,238,0.22) 25%,rgba(96,165,250,0.28) 75%,transparent 97%)',
          }}
        />

        {/* Right — login card (730 px wide) */}
      </div>
    </LocalLayout>
  );
}
