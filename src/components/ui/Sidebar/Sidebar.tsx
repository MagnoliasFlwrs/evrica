import React, {useState} from 'react';
import styles from './sidebar.module.scss';
import {Link, useLocation} from "react-router-dom";
import Logo from "../../../icons/Logo";
import {Flex} from "antd";
import SidebarButton from "../../../icons/SidebarButton";
import Home from "../../../icons/Home";
import Settings from "../../../icons/Settings";
import Calls from "../../../icons/Calls";
import Analytic from "../../../icons/Analytic";
import Support from "../../../icons/Support";
import Profile from "../../../icons/Profile";
import cn from 'classnames';
import {useSidebar} from "./useSidebar";

const Sidebar = () => {
    const { sidebarOpen, toggleSidebar } = useSidebar();
    const location = useLocation();


    const isActiveLink = (linkPath: string) => {
        if (location.pathname === linkPath) return true;
        if (linkPath !== '/' && location.pathname.startsWith(linkPath)) return true;
        if (linkPath === '/' && location.pathname === '/') return true;
        return false;
    };

    return (
        <Flex className={cn(styles.Sidebar, { [styles.active]: sidebarOpen })}>
            <Link className={styles.SidebarLogo} to='/'>
                <Flex className={styles.SidebarLogoContainer}>
                    <Logo/>
                </Flex>
                {
                    sidebarOpen &&
                    <Flex className={styles.SidebarLogoTitleContainer} vertical>
                        <Flex className={styles.SidebarLogoTitle}>
                            <span>ЭВРИКА</span>
                            <span>360</span>
                        </Flex>
                        <span className={styles.SidebarLogoTitleDescription}>Стратегия правильных решений</span>
                    </Flex>
                }
            </Link>

            <Flex vertical gap={20}>
                <Flex className={styles.SidebarButton} onClick={() => toggleSidebar()}>
                    <SidebarButton/>
                </Flex>

                <Link
                    to='/'
                    className={cn(styles.SidebarLink, {
                        [styles.active]: isActiveLink('/')
                    })}
                >
                    <Flex className={styles.SidebarIconWrapper}>
                        <Home/>
                    </Flex>
                    {sidebarOpen && <span>Главная</span>}
                </Link>

                <Link
                    to='/analytics'
                    className={cn(styles.SidebarLink, {
                        [styles.active]: isActiveLink('/analytics')
                    })}
                >
                    <Flex className={styles.SidebarIconWrapper}>
                        <Analytic/>
                    </Flex>
                    {sidebarOpen && <span>Аналитика</span>}
                </Link>

                <Link
                    to='/calls'
                    className={cn(styles.SidebarLink, {
                        [styles.active]: isActiveLink('/calls')
                    })}
                >
                    <Flex className={styles.SidebarIconWrapper}>
                        <Calls/>
                    </Flex>
                    {sidebarOpen && <span>Звонки</span>}
                </Link>

                <Link
                    to='/settings'
                    className={cn(styles.SidebarLink, {
                        [styles.active]: isActiveLink('/settings')
                    })}
                >
                    <Flex className={styles.SidebarIconWrapper}>
                        <Settings/>
                    </Flex>
                    {sidebarOpen && <span>Настройка</span>}
                </Link>
            </Flex>

            <Flex vertical gap={20} className={styles.SidebarSupportRow}>
                <Link
                    to='/support'
                    className={cn(styles.SidebarLink, {
                        [styles.active]: isActiveLink('/support')
                    })}
                >
                    <Flex className={styles.SidebarIconWrapper}>
                        <Support/>
                    </Flex>
                    {sidebarOpen && <span>Поддержка</span>}
                </Link>

                <Link
                    to='/profile'
                    className={cn(styles.SidebarLink, {
                        [styles.active]: isActiveLink('/profile')
                    })}
                >
                    <Flex className={styles.SidebarIconWrapper}>
                        <Profile/>
                    </Flex>
                    {sidebarOpen && <span>Профиль</span>}
                </Link>
            </Flex>
        </Flex>

    );
};

export default Sidebar;