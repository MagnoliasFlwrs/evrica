import React from 'react';
import styles from './CustomTextModal.module.scss';
import { Flex } from "antd";

interface ICustomTextModalProps {
    text?: string;
    content?: React.ReactNode;
    top?: boolean;
    left?: boolean;
    right?: boolean;
    bottom?: boolean;
}

const CustomTextModal: React.FC<ICustomTextModalProps> = ({
                                                              text,
                                                              content,
                                                              top,
                                                              bottom,
                                                              right,
                                                              left
                                                          }) => {
    const getPositionStyles = () => {
        const styles: React.CSSProperties = {};

        if (top) {
            styles.bottom = '100%';
        } else if (bottom) {
            styles.top = '100%';
        }

        if (left) {
            styles.right = '50%';
        } else if (right) {
            styles.left = '50%';
        }

        return styles;
    };

    const renderContent = () => {
        if (content) return content;
        if (text) return <span>{text}</span>;
        return null;
    };

    return (
        <Flex
            className={styles.CustomTextModal}
            style={getPositionStyles()}
        >
            {renderContent()}
        </Flex>
    );
};

export default CustomTextModal;