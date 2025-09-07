import React from 'react';
import { Flex } from "antd";
import styles from "../CallsOptions.module.scss";
import { callsOptionsMarkersColors } from '../utils'

interface CallsOptionsMarkerItemProps {
    item: {
        type: string;
        count: number;
    };
    key: number;
}

const CallsOptionsMarkerItem = ({ item, key }: CallsOptionsMarkerItemProps) => {
    const getColorByMarkerType = () => {
        switch(item?.type.toLowerCase()) {
            case 'возражение "дорого"':
                return callsOptionsMarkersColors.blue;
            case 'не хочу':
                return callsOptionsMarkersColors.aqua;
            case 'oбещали перезвонить':
                return callsOptionsMarkersColors.green;
            case 'не помогли':
                return callsOptionsMarkersColors.purple;
            default:
                return callsOptionsMarkersColors.blue; // цвет по умолчанию
        }
    };

    const colorConfig = getColorByMarkerType();

    return (
        <Flex className={styles.CallsOptionsMarkerItem} key={key}>
            <Flex
                className={styles.CallsOptionsMark}
                style={{
                    backgroundColor: colorConfig.bgColor,
                    color: colorConfig.color
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