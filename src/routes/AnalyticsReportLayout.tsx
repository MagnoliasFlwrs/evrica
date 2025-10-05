import React, {useState} from 'react';
import {Flex} from "antd";
import styles from "../components/AnalyticsReportLayout/AnalyticsReportLayout.module.scss";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import CustomSwitcher from "../components/ui/CustomSwitcher/CustomSwitcher";
import PageContainer from "../components/ui/PageContainer/PageContainer";
import AnalyticsReportLayoutControl from "../components/AnalyticsReportLayout/AnalyticsReportLayoutControl";
import {Value} from "../components/ui/CustomDatePicker/types";
import AnalyticResults from "../components/AnalyticsReportLayout/AnalyticResults";

const AnalyticsReportLayout = () => {
    const [openCustomDatePicker, setOpenCustomDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Value>([new Date(2025, 3, 11), new Date(2025, 8, 19)]);

    const handleDateChange = (date: Value) => {
        setSelectedDate(date);
    };
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
                <CustomSwitcher items={switchItems} disable={true}/>
            </Flex>
            <AnalyticsReportLayoutControl
                openCustomDatePicker={openCustomDatePicker}
                setOpenCustomDatePicker={setOpenCustomDatePicker}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />
            <AnalyticResults/>

        </PageContainer>
    );
};

export default AnalyticsReportLayout;