import React, {useState} from 'react';
import {Checkbox, Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'

const CheckListsWidgetSwiper = () => {
    const [checkBoxValue, setCheckBoxValue] = useState<boolean>(false)
    return (
        <Flex className={styles.CheckListsWidgetSwiperContainer}>
            <Flex className={styles.CheckListsWidgetCheckbox}>
                <Checkbox value={checkBoxValue}>Показать только общие чек-листы</Checkbox>
            </Flex>
        </Flex>
    );
};

export default CheckListsWidgetSwiper;