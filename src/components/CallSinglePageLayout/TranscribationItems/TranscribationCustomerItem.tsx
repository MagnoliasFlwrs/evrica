import React from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";

interface Props {
    item: {
        type: string;
        time: string;
        text: string;
    };
}
const TranscribationCustomerItem:React.FC<Props> = ({item}) => {
    return (
        <Flex className={styles.TranscribationCustomerItem}>
            <Flex className={styles.dateRow}>
                <span>{item?.time}</span>
                <span>Клиент</span>
            </Flex>
            <Flex className={styles.textRow}>
                {item?.text}
            </Flex>
        </Flex>
    );
};

export default TranscribationCustomerItem;