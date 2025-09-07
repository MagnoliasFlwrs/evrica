import React from 'react';
import { Flex } from "antd";
import styles from '../CallsOptions.module.scss';
import { callsOptionsCheckListColors } from '../utils'

interface CallsOptionsCheckListsItemProps {
    item: {
        type: string;
        percent: string;
        checkListCompleting: number;
    };
    key: number;
}

const CallsOptionsCheckListsItem = ({ item, key }: CallsOptionsCheckListsItemProps) => {

    const getColorByPercent = (percent: string) => {
        const percentNumber = parseInt(percent.replace('%', ''), 10);

        if (percentNumber > 85) {
            return callsOptionsCheckListColors.green;
        } else if (percentNumber > 50) {
            return callsOptionsCheckListColors.orange;
        } else {
            return callsOptionsCheckListColors.gray;
        }
    };

    const colorConfig = getColorByPercent(item?.percent);

    return (
        <Flex className={styles.CallsOptionsCheckListsItem} key={key}>
            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowType}>{item?.type}</p>
                <Flex
                    className={styles.CallsOptionsCheckListsItemRowPercentMark}
                    style={{
                        backgroundColor: colorConfig.bgColor,
                        border: `1px solid ${colorConfig.color}`,
                    }}
                >
                    <span style={{ color: colorConfig.color }}>
                        {item?.percent}
                    </span>
                </Flex>
            </Flex>
            <Flex className={styles.CallsOptionsCheckListsItemRow}>
                <p className={styles.CallsOptionsCheckListsItemRowCompleting}>Выполнение чек-листа</p>
                <Flex className={styles.CallsOptionsCheckListsItemRowCheckListMark}>
                    <span>{item?.checkListCompleting}</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CallsOptionsCheckListsItem;