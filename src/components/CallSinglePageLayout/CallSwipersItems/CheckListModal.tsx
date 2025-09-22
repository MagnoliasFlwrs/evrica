import React from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'

const CheckListModal = () => {
    return (
        <Flex className={styles.CheckListModal}>
            <Flex className={styles.CheckListModalHead} vertical>
                <p>HR</p>
                <p>HR</p>
                <p>HR</p>
                <p>HR</p>
                <p>HR</p>
                <p>HR</p>
                <p>HR</p>
            </Flex>
        </Flex>
    );
};

export default CheckListModal;