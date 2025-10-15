import React from 'react';
import { Flex} from "antd";
import styles from "../../AnalyticsReportLayout.module.scss";
import MarkersWidgetAccordeon from "./MarkersWidgetAccordeon";

const MarkersWidgetSwiper = () => {
    return (
        <Flex className={styles.CheckListsWidgetSwiperContainer}>
            <Flex className={styles.CheckListsWidgetAccordeons}>
                <MarkersWidgetAccordeon/>
            </Flex>
        </Flex>
    );
};

export default MarkersWidgetSwiper;