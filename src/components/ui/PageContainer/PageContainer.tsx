import React, { ReactNode } from 'react';
import { Flex } from "antd";
import { useSidebar } from "../Sidebar/useSidebar";
import styles from './PageContainer.module.scss'
import classNames from 'classnames';

interface PageContainerProps {
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
                                                         children,
                                                         style,
                                                         className
                                                     }) => {
    const { sidebarOpen } = useSidebar();

    const containerClasses = classNames(
        styles.PageContainer,
        {
            [styles.short]: sidebarOpen,
        },
        className
    );

    return (
        <Flex
            vertical
            className={containerClasses}
            style={style}
        >
            {children}
        </Flex>
    );
};

export default PageContainer;