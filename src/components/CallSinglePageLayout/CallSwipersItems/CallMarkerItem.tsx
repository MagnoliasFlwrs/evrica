import React, {useState} from 'react';
import { Flex } from "antd";
import styles from '../CallSinglePageLayout.module.scss';
import {callsOptionsMarkersColors} from "../../CallsFilteredLayout/CallsOptions/utils";
import MinusIcon from "./MinusIcon";
import PlusIcon from "./PlusIcon";
import {MarkerItem, MarkerModalState} from "../types";

interface CallsOptionsMarkerItemProps {
    item: MarkerItem;
    key: number;
    setShowMarkerModal: (value: MarkerModalState) => void;
}

const CallMarkerItem = ({ item, key , setShowMarkerModal }: CallsOptionsMarkerItemProps) => {
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
                return callsOptionsMarkersColors.blue;
        }
    };

    const colorConfig = getColorByMarkerType();

    const handleClick = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setShowMarkerModal({
            show: true,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.bottom
            },
            item: item
        });
    };

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
                <Flex className={styles.CallsOptionsMarkCount}
                      onClick={handleClick}
                >
                    {item?.count}
                </Flex>
            </Flex>

            {
                isTriggered ?
                    <button className={styles.showTriggered} onClick={() => setIsTriggered(false)}>
                        <span className={styles.triggeredIcon}>
                            <PlusIcon/>
                        </span>
                        Убрать срабатывание
                    </button>
                    :
                    <button className={styles.showTriggered} onClick={() => setIsTriggered(true)}>
                        <span className={styles.noTriggeredIcon}>
                            <MinusIcon/>
                        </span>
                        Показать срабатывание
                    </button>
            }
        </Flex>
    );
};

export default CallMarkerItem;