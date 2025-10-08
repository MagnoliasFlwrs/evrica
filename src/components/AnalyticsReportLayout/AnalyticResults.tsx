import React from 'react';
import {Flex} from "antd";
import styles from "./AnalyticsReportLayout.module.scss";
import BlueButton from "../ui/BlueButton/BlueButton";
import DownloadIcon from "../icons/DownloadIcon";
import CategoriesStatsWidget from "./AnalyticResultsComponents/widgets/CategoriesStatsWidget";
import CustomBlueAccordeon from "../ui/CustomBlueAccordeon/CustomBlueAccordeon";
import CategoriesWidget from "./AnalyticResultsComponents/widgets/CategoriesWidget";
import CallsWidgetSwiper from "./AnalyticResultsComponents/widgets/CallsWidgetSwiper";
import { SwiperManagerProvider } from "./hooks/SwiperManagerContext";
import CheckListsWidgetSwiper from "./AnalyticResultsComponents/widgets/CheckListsWidgetSwiper";

const AnalyticResults = () => {
    return (
        <SwiperManagerProvider>
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
                <CategoriesWidget/>
                <CustomBlueAccordeon title='Звонки' children={<CallsWidgetSwiper/>}/>
                <CustomBlueAccordeon title='Чек-листы' children={<CheckListsWidgetSwiper/>}/>

            </Flex>
        </SwiperManagerProvider>
    );
};

export default AnalyticResults;