import React, {useState} from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss';
import { callsOptionsCheckListColors } from '../../CallsFilteredLayout/CallsOptions/utils'
import CheckListModal from "./CheckListModal";

interface CallsOptionsCheckListsItemProps {
    item: {
        type: string;
        percent: string;
        checkListCompleting: number;
    };
    key: number;
}

const CallCheckListsItem = ({ item, key }: CallsOptionsCheckListsItemProps) => {

    const [isTriggered, setIsTriggered] = useState(false);

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

                        <span style={{color: colorConfig.color}}>
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

export default CallCheckListsItem;