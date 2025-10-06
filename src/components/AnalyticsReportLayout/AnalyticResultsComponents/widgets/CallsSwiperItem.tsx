import React from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'

interface CallsSwiperItemProps {
    item:{
        total:number,
        outgoing:number,
        incoming:number,
        recognized:number
    }
}

const CallsSwiperItem = ({item}:CallsSwiperItemProps) => {
    return (
        <Flex className={styles.CallsSwiperItem}>
            <ul>
                <li>
                    <p>Всего звонков</p>
                    <span>{item?.total}</span>
                </li>
                <li>
                    <p>Входящих</p>
                    <span>{item?.incoming}</span>
                </li>
                <li>
                    <p>Исходящих</p>
                    <span>{item?.outgoing}</span>
                </li>
                <li>
                    <p>Распознано</p>
                    <span>{item?.recognized}%</span>
                </li>
            </ul>
        </Flex>
    );
};

export default CallsSwiperItem;