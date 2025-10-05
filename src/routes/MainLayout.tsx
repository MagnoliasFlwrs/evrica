import React from 'react';
import { Flex } from "antd";
import Sidebar from "../components/ui/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import styles from '../styles/MainLayout.module.scss';

const MainLayout = () => {
    const location = useLocation();

    const isCallDetailPage = location.pathname.includes('/call/') || location.pathname.includes('/analytics');

    return (
        <Flex
            style={{ padding: '20px', minHeight: "100vh", width: "100vw" }}
            className={isCallDetailPage ? styles.grayBg : ''}
        >
            <Sidebar/>
            <Outlet/>
        </Flex>
    );
};

export default MainLayout;