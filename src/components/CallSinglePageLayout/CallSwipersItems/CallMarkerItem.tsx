import React, {useState} from 'react';
import { Flex } from "antd";
import styles from '../CallSinglePageLayout.module.scss';
import { callsOptionsMarkersColors } from '../../CallsFilteredLayout/CallsOptions/utils'

interface CallsOptionsMarkerItemProps {
    item: {
        type: string;
        count: number;
    };
    key: number;
}

const CallMarkerItem = ({ item, key }: CallsOptionsMarkerItemProps) => {
    const [isTriggered, setIsTriggered] = useState(false);

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
            <Flex className={styles.CallsOptionsMarkerItemContainer}>
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

            {
                isTriggered ?
                    <button className={styles.showTriggered} onClick={() => setIsTriggered(false)}>
                        <span className={styles.triggeredIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2"
                                 fill="none">
                              <path d="M1.33325 1H10.6666" stroke="white" strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                        </span>
                        Убрать срабатывание
                    </button>
                    :
                    <button className={styles.showTriggered} onClick={() => setIsTriggered(true)}>
                        <span className={styles.noTriggeredIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                 fill="none">
                              <path d="M3.33325 8H12.6666" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                              <path d="M8 3.33337V12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                            </svg>
                        </span>
                        Показать срабатывание
                    </button>
            }
        </Flex>
    );
};

export default CallMarkerItem;