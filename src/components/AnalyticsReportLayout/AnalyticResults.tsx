import React from 'react';
import {Flex} from "antd";
import styles from "./AnalyticsReportLayout.module.scss";
import BlueButton from "../ui/BlueButton/BlueButton";
import DownloadIcon from "../icons/DownloadIcon";
import CategoriesStatsWidget from "./AnalyticResultsComponents/widgets/CategoriesStatsWidget";
import CustomBlueAccordeon from "../ui/CustomBlueAccordeon/CustomBlueAccordeon";

const AnalyticResults = () => {

    return (
        <Flex className={styles.AnalyticResultsContainer}>
            <Flex className={styles.AnalyticResultsContainerHead}>
                <p>Результат анализа категорий</p>
                <BlueButton text='Скачать отчет' icon={<DownloadIcon/>} iconPosition='start'/>
            </Flex>
            <Flex className={styles.GeneralStatsWidgets}>
                <CategoriesStatsWidget/>
                <Flex className={styles.GeneralStatsWidgetsMarkers}>
                    <Flex className={styles.GeneralStatsWidgetsMarker}>
                        <p>Негативные маркеры</p>
                        <Flex className={styles.negative}>
                            <span>15</span>
                        </Flex>
                    </Flex>
                    <Flex className={styles.GeneralStatsWidgetsMarker}>
                        <p>Позитивные марекеры</p>
                        <Flex className={styles.positive}>
                            <span>115</span>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <CustomBlueAccordeon title='Звонки'/>
        </Flex>
    );
};

export default AnalyticResults;