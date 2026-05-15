import { ConfigProvider, DatePicker, Flex } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar/Sidebar';
import { useAuth } from '../store';
import styles from '../styles/MainLayout.module.scss';
const { RangePicker } = DatePicker;

const MainLayout = () => {
  const location = useLocation();

  const isGrayBgPage =
    location.pathname.includes('/call/') ||
    location.pathname.includes('/analytics') ||
    location.pathname.includes('/settings');

  const getAuthUser = useAuth((state) => state.getAuthUser);

  useEffect(() => {
    getAuthUser();
  }, [getAuthUser]);

  return (
    <ConfigProvider locale={ruRU}>
      <Flex
        style={{ padding: '20px', minHeight: '100vh', width: '100vw' }}
        className={isGrayBgPage ? styles.grayBg : ''}
      >
        <Sidebar />
        <Outlet />
      </Flex>
    </ConfigProvider>
  );
};

export default MainLayout;
