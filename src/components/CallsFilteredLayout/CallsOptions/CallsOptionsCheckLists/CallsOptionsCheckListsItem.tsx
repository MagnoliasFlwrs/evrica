import React from 'react';
import { Flex } from "antd";
import styles from '../CallsOptions.module.scss';
import {ChecklistsSearch} from "../../../../stores/types/callsStoreTypes";
import {hexToRgba} from '../utils';

interface CallsOptionsCheckListsItemProps {
    item: ChecklistsSearch;
    onOpen: (item: ChecklistsSearch) => void;
}

const getAveragePercentage = (item: ChecklistsSearch): number | null => {
    const avg = item?.average;
    if (avg && typeof avg === 'object' && !Array.isArray(avg) && 'percentage' in avg) {
        const p = (avg as { percentage?: number }).percentage;
        return typeof p === 'number' ? p : null;
    }
    return null;
};

const CallsOptionsCheckListsItem = ({ item, onOpen }: CallsOptionsCheckListsItemProps) => {
    const accentColor =
        item?.color_success ??
        item?.checklist?.color_success ??
        '#3B82F6';
    const bgColor = hexToRgba(accentColor, 0.18) ?? accentColor;
    const averagePct = getAveragePercentage(item);
    const percentLabel =
        averagePct != null ? `${averagePct}%` : '—';

    return (
        <Flex
            className={styles.CallsOptionsCheckListsItem}
            onClick={() => onOpen(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen(item);
                }
            }}
        >
            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowType}>{item?.checklist?.name}</p>
                <Flex
                    className={styles.CallsOptionsCheckListsItemRowPercentMark}
                    style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${accentColor}`,
                    }}
                >
                    <span style={{ color: accentColor }}>
                        {percentLabel}
                    </span>
                </Flex>
            </Flex>
            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowCompleting}>Выполнение чек-листа</p>
                <Flex className={styles.CallsOptionsCheckListsItemRowCheckListMark}>
                    <span>-</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CallsOptionsCheckListsItem;
