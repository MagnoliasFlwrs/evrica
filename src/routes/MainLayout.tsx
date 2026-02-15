import React, {useEffect} from 'react';
import {ConfigProvider, DatePicker, Flex} from "antd";
import Sidebar from "../components/ui/Sidebar/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import styles from '../styles/MainLayout.module.scss';
import {useAuth} from "../store";
import ruRU from "antd/locale/ru_RU";
const { RangePicker } = DatePicker;
const MainLayout = () => {
    const location = useLocation();

    const isCallDetailPage = location.pathname.includes('/call/') || location.pathname.includes('/analytics');

    const getAuthUser = useAuth((state)=>state.getAuthUser);

    useEffect(() => {
        getAuthUser()
    }, []);

    return (
        <ConfigProvider locale={ruRU}>
            <Flex
                style={{ padding: '20px', minHeight: "100vh", width: "100vw" }}
                className={isCallDetailPage ? styles.grayBg : ''}
            >
                <Sidebar/>
                <Outlet/>
            </Flex>
        </ConfigProvider>
    );
};

export default MainLayout;