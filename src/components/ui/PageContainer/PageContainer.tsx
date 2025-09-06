import React, { ReactNode } from 'react';
import { Flex } from "antd";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
                                                         children,
                                                         className
                                                     }) => {
    return (
        <Flex
            style={{ padding: '40px 20px', flex:1 }}
            vertical
            className={className}
        >
            {children}
        </Flex>
    );
};

export default PageContainer;