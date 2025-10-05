import React from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'

interface ChartContainerItemProps {
    item: {
        title: string,
        value: number
    }
}

const ChartContainerItem = ({item}: ChartContainerItemProps) => {

    const getBgColor = (value: number): string => {
        if (value >= 91 && value <= 100) return '#007AFF';
        if (value >= 81 && value <= 90) return 'rgba(0, 122, 255, 0.87)';
        if (value >= 51 && value <= 80) return 'rgba(0, 122, 255, 0.60)';
        if (value >= 41 && value <= 50) return 'rgba(0, 122, 255, 0.46)';
        if (value >= 21 && value <= 40) return 'rgba(0, 122, 255, 0.15)';
        if (value >= 1 && value <= 20) return 'rgba(0, 122, 255, 0.10)';


        return 'rgba(0, 122, 255, 0.10)';
    };

    const bgColor = getBgColor(item.value);

    return (
        <Flex className={styles.ChartContainerItem}>
            <span style={{background: bgColor, height: item.value}}></span>
            <p>{item?.title}</p>
        </Flex>
    );
};

export default ChartContainerItem;