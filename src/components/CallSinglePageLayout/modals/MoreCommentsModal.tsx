import React from 'react';
import {Flex} from "antd";
import styles from '../CallSinglePageLayout.module.scss'

const MoreCommentsModal = () => {
    return (
        <Flex className={styles.MoreCommentsModal}>
            <ul>
                <li>
                    <span>11 апр 2025 11:45</span>
                    <p>Звонок записан не до коцна</p>
                </li>
                <li>
                    <span>11 апр 2025 11:45</span>
                    <p>Звонок записан не до коцна</p>
                </li>
                <li>
                    <span>11 апр 2025 11:45</span>
                    <p>Звонок записан не до коцна
                        Звонок записан не до коцна
                        Звонок записан не до коцна
                        Звонок записан не до коцна
                    </p>
                </li>
                <li>
                    <span>11 апр 2025 11:45</span>
                    <p>Звонок записан не до коцна</p>
                </li>
                <li>
                    <span>11 апр 2025 11:45</span>
                    <p>Звонок записан не до коцна</p>
                </li>
            </ul>
        </Flex>
    );
};

export default MoreCommentsModal;