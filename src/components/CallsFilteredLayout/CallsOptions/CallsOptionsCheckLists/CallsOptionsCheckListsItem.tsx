import React from 'react';
import { Flex } from "antd";
import styles from '../CallsOptions.module.scss';
import {ChecklistsSearch} from "../../../../stores/types/callsStoreTypes";
import {getColorByPercent} from "../../../CallSinglePageLayout/utils";

interface CallsOptionsCheckListsItemProps {
    item: ChecklistsSearch;
    key: number;
}

const CallsOptionsCheckListsItem = ({ item, key }: CallsOptionsCheckListsItemProps) => {


    const colorConfig = getColorByPercent(item?.limit_result);

    return (
        <Flex className={styles.CallsOptionsCheckListsItem} key={key}>
            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowType}>{item?.checklist.name}</p>
                <Flex
                    className={styles.CallsOptionsCheckListsItemRowPercentMark}
                    style={{
                        backgroundColor: colorConfig.bgColor,
                        border: `1px solid ${colorConfig.color}`,
                    }}
                >
                    <span style={{ color: colorConfig.color }}>
                        {item?.limit_result}
                    </span>
                </Flex>
            </Flex>
            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowCompleting}>Выполнение чек-листа</p>
                <Flex className={styles.CallsOptionsCheckListsItemRowCheckListMark}>
                    <span>{item?.limit_result}</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CallsOptionsCheckListsItem;