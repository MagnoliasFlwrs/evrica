import React, {useEffect, useState} from 'react';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import styles from "../components/AnalyticsLayout/AnalyticsLayout.module.scss";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import {Flex} from "antd";
import CustomSwitcher from "../components/ui/CustomSwitcher/CustomSwitcher";
import AnalyticsDatePicker from "../components/AnalyticsLayout/AnalyticsDatePicker";
import AnalyticsTree from "../components/AnalyticsLayout/AnalyticsTree";
import {useAnalyticsStore} from "../stores/analyticsStore";

const AnalyticsLayout = () => {
    const [isSelected, setIsSelected] = useState(0);
    const getAllAgents = useAnalyticsStore((state)=> state.getAllAgents);

    // состояние чтобы понимать на какой вкладке и какой контент рисовать
    const [selectedSwitchItem, setSelectedSwitchItem] = useState(1);

    useEffect(() => {
        getAllAgents()
    }, []);

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
                <CustomSwitcher items={switchItems} setSelectedSwitchItem={setSelectedSwitchItem}/>
            </Flex>
            {
                selectedSwitchItem == 0 && <p>categories</p>
            }
            {
                selectedSwitchItem == 1 &&
                <Flex className={styles.AnalyticPageLayoutFilter}>
                    <AnalyticsTree setIsSelected={setIsSelected}/>
                    <AnalyticsDatePicker/>
                </Flex>
            }

        </PageContainer>
    );
};

export default AnalyticsLayout;