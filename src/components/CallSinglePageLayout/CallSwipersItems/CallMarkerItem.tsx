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
        // Пока нет маппинга по реальным словарям — используем дефолтный цвет
        switch(item?.name.toLowerCase()) {
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
                    {item?.name}
                </Flex>
                {/* <Flex className={styles.CallsOptionsMarkCount}
                      onClick={handleClick}
                >
                    {item?.count}
                </Flex> */}
            </Flex>

            {item?.search_text_highlight_full?.length > 0 && (
                <div
                    className={[
                        styles.markerTriggered,
                        isTriggered ? styles.markerTriggeredOpen : styles.markerTriggeredClosed
                    ].join(' ')}
                    aria-hidden={!isTriggered}
                >
                    {item.search_text_highlight_full.map((group, groupIndex) => (
                        <div className={styles.markerTriggeredGroup} key={`${item.id}-${groupIndex}`}>
                            {group.map((line, lineIndex) => (
                                <p
                                    key={`${item.id}-${groupIndex}-${lineIndex}`}
                                    className={styles.markerTriggeredLine}
                                    dangerouslySetInnerHTML={{ __html: line }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

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