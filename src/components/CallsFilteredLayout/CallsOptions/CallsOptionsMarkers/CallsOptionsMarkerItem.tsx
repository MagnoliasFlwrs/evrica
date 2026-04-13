import React from 'react';
import { Flex } from "antd";
import styles from "../CallsOptions.module.scss";
import { hexToRgba } from '../utils';

interface CallsOptionsMarkerItemProps {
    item: {
        type: string;
        count: number;
        colorSuccess?: string;
    };
}

const CallsOptionsMarkerItem = ({ item }: CallsOptionsMarkerItemProps) => {
    const accentColor = item?.colorSuccess ?? '#3B82F6';
    const bgColor = hexToRgba(accentColor, 0.18) ?? accentColor;
    const textColor = accentColor;

    return (
        <Flex className={styles.CallsOptionsMarkerItem}>
            <Flex
                className={styles.CallsOptionsMark}
                style={{
                    backgroundColor: bgColor,
                    color: textColor
                }}
            >
                {item?.type}
            </Flex>
            <Flex className={styles.CallsOptionsMarkCount}>
                {item?.count}
            </Flex>
        </Flex>
    );
};

export default CallsOptionsMarkerItem;