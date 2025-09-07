import React, { ReactNode } from 'react';
import { Flex } from "antd";
import { useSidebar } from "../Sidebar/useSidebar";
import styles from './PageContainer.module.scss'
import classNames from 'classnames'; // рекомендуется использовать classnames

interface PageContainerProps {
    children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
    const { sidebarOpen } = useSidebar();

    const containerClasses = classNames(
        styles.PageContainer,
        {
            [styles.short]: sidebarOpen
        }
    );

    return (
        <Flex
            vertical
            className={containerClasses}
        >
            {children}
        </Flex>
    );
};

export default PageContainer;