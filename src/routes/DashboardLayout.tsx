import React from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import styles from '../components/DashboardLayout/DashboardLayout.module.scss'
import {Flex, Modal} from "antd";
import {useAuth} from "../store";
import Profile from "../icons/Profile";
import LogoutIcon from "../components/icons/LogoutIcon";
import CallsChart from "../components/DashboardLayout/CallsChart";

const DashboardLayout = () => {
    const user = useAuth((state)=> state.user);
    const logout = useAuth((state)=> state.logout);
    const [modal, contextHolder] = Modal.useModal();

    const handleLogout = () => {

    }

    const showConfirm = () => {
        modal.confirm({
            title: 'Вы собираетесь выйти из аккаунта',
            okText: 'Выйти',
            cancelText: 'Отмена',
            onOk() {
                logout()
            },
        });
    };

    return (
        <PageContainer>
            <Flex className={styles.dashboardHead}>
                <p>Привет, {user?.fullName || 'Пользователь'}</p>
                <Flex className={styles.dashboardButtons}>
                    <a href="#" className={styles.dashboardButton}>
                        <Profile/>
                    </a>
                    <span className={styles.dashboardButton} onClick={showConfirm}>
                        <LogoutIcon/>
                    </span>
                </Flex>

            </Flex>
            <Flex className={styles.chartCard}>
                <CallsChart />
            </Flex>
            {contextHolder}
        </PageContainer>
    );
};

export default DashboardLayout;