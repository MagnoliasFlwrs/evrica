import React from 'react';
import styles from '../CallSinglePageLayout.module.scss'
import {Flex} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import PlusIcon from "../icons/PlusIcon";

const CommentsWidget = () => {
    return (
        <Flex className={styles.CommentsWidget}>
            <Flex className={styles.CommentsWidgetHead}>
                <p>Комментарии</p>
            </Flex>
            <Flex className={styles.CommentsWidgetList}>
                <Flex className={styles.CommentsWidgetListItem}>
                    <p>11 апр 2025 11:45</p>
                    <span>Звонок записан не до коцна</span>
                </Flex>
                <Flex className={styles.CommentsWidgetListItem}>
                    <p>11 апр 2025 11:45</p>
                    <span>Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар
                        Оператор не поздоровался и не предложил товар</span>
                </Flex>
            </Flex>
            <Flex className={styles.CommentsWidgetControls}>
                <Flex className={styles.CommentsWidgetShowMore}>
                    <p>Еще</p>
                    <span>4</span>
                </Flex>
                <button>
                    <PlusIcon/>
                </button>
            </Flex>
        </Flex>
    );
};

export default CommentsWidget;