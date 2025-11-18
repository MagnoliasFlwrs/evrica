import React, { useState } from 'react';
import { Flex } from "antd";
import styles from '../CallSinglePageLayout.module.scss';
import PlusIcon from "./PlusIcon";
import MinusIcon from "./MinusIcon";
import {getColorByPercent} from "../utils";
import {CheckListItem} from "../types";
import {ChecklistsSearch} from "../../../stores/types/callsStoreTypes";


interface CallsOptionsCheckListsItemProps {
    item: ChecklistsSearch;
    setShowCheckListModal: (value: {
        show: boolean;
        position: { x: number; y: number } | null;
        item: ChecklistsSearch | null;
    }) => void;
}

const CallCheckListsItem: React.FC<CallsOptionsCheckListsItemProps> = ({ item, setShowCheckListModal }) => {
    const [isTriggered, setIsTriggered] = useState(false);

    const colorConfig = getColorByPercent(item?.limit_result);

    const handlePercentClick = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setShowCheckListModal({
            show: true,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.bottom
            },
            item: item
        });
    };

    return (
        <Flex className={styles.CallsOptionsCheckListsItem}>

            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowType}>{item?.checklist.name}</p>
                <Flex
                    className={styles.CallsOptionsCheckListsItemRowPercentMark}
                    style={{
                        backgroundColor: colorConfig.bgColor,
                        border: `1px solid ${colorConfig.color}`,
                        cursor: 'pointer'
                    }}
                    onClick={handlePercentClick}
                >
                    <span style={{ color: colorConfig.color }}>
                        {item?.limit_result}
                    </span>
                </Flex>
            </Flex>
            {/*<Flex className={styles.CallsOptionsCheckListsItemRow}>*/}
            {/*    <p className={styles.CallsOptionsCheckListsItemRowCompleting}>Выполнение чек-листа</p>*/}
            {/*    <Flex className={styles.CallsOptionsCheckListsItemRowCheckListMark}>*/}
            {/*        <span>{item?.checkListCompleting}</span>*/}
            {/*    </Flex>*/}
            {/*</Flex>*/}
            {isTriggered ? (
                <button className={styles.showTriggered} onClick={() => setIsTriggered(false)}>
                    <span className={styles.triggeredIcon}>
                        <PlusIcon/>
                    </span>
                    Убрать срабатывание
                </button>
            ) : (
                <button className={styles.showTriggered} onClick={() => setIsTriggered(true)}>
                    <span className={styles.noTriggeredIcon}>
                        <MinusIcon/>
                    </span>
                    Показать срабатывание
                </button>
            )}
        </Flex>
    );
};

export default CallCheckListsItem;