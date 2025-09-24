import React, {useState} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import styles from "../components/AnalyticsLayout/AnalyticsLayout.module.scss";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import {Flex} from "antd";
import CustomSwitcher from "../components/ui/CustomSwitcher/CustomSwitcher";
import AnalyticsDatePicker from "../components/AnalyticsLayout/AnalyticsDatePicker";
import AnalyticsTree from "../components/AnalyticsLayout/AnalyticsTree";

const AnalyticsLayout = () => {
    const [isSelected, setIsSelected] = useState(0);

    const switchItems = [
        {
            title: 'Категории'
        },
        {
            title: 'Сотрудники'
        },
    ]

    return (
        <PageContainer>
            <Flex className={styles.AnalyticPageLayoutHead}>
                <PageTitle text='Аналитика'/>
                <CustomSwitcher items={switchItems}/>
            </Flex>
            <Flex className={styles.AnalyticPageLayoutFilter}>
                <AnalyticsTree setIsSelected={setIsSelected}/>
                <AnalyticsDatePicker/>
            </Flex>
        </PageContainer>
    );
};

export default AnalyticsLayout;