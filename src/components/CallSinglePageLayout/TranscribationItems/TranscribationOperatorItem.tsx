import React from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'


interface Props {
    item: {
        type: string;
        time: string;
        text: string;
    };
}
const TranscribationOperatorItem:React.FC<Props> = ({item}) => {
    return (
        <Flex className={styles.TranscribationOperatorItem}>
            <Flex className={styles.dateRow}>
                <span>{item?.time}</span>
                <span>Оператор</span>
            </Flex>
            <Flex className={styles.textRow}>
                {item?.text}
            </Flex>
        </Flex>
    );
};

export default TranscribationOperatorItem;