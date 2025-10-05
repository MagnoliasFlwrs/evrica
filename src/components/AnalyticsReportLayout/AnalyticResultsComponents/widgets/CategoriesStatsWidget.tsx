import React, {useState} from 'react';
import {Flex} from "antd";
import styles from '../../AnalyticsReportLayout.module.scss'
import CustomSelect from "../../../ui/CustomSelect/CustomSelect";
import ChartContainerItem from "./ChartContainerItem";

const CategoriesStatsWidget = () => {
    const [checkList, setCheckList] = useState<string>('');

    const callTypeOptions = [
        { value: 'incoming', label: 'Название чек-листа 1' },
        { value: 'outgoing', label: 'Название чек-листа 2' },
        { value: 'missed', label: 'Название чек-листа 3' }
    ];
    const chartOptions = [
        {
            title:'Отдел по борьбе с нарушениями',
            value:46,
        },
        {
            title:'Отдел по борьбе с нарушениями',
            value:79,
        },
        {
            title:'Операторы call-центра',
            value:100,
        },
        {
            title:'Просто прекрасный отдел',
            value:87,
        },
        {
            title:'Отдел по особо важным делам',
            value:40,
        },
        {
            title:'Отдел по особо важным делам',
            value:10,
        },
        {
            title:'Отдел по особо важным делам',
            value:40,
        },
        {
            title:'Просто название отдеола',
            value:46,
        },
        {
            title:'Просто название отдеола',
            value:100,
        },
        {
            title:'Еще один отдел',
            value:15,
        },
    ]

    return (
        <Flex className={styles.CategoriesStatsWidgetContainer}>
            <p className={styles.CategoriesStatsWidgetContainerTitle}>Статистика по выбранным категориям</p>
            <Flex className={styles.CategoriesStatsContainer}>
                <Flex className={styles.StatsContainer}>
                    <CustomSelect
                        options={callTypeOptions}
                        multiple={true}
                        placeholder="Все чек-листы"
                        value={checkList}
                        onChange={(value) => {
                            if (typeof value === 'string') {
                                setCheckList(value);
                            }
                        }}
                        width='199px'
                    />
                    <Flex className={styles.StatsContainerBlock}>
                        <p>Процент выполнения
                            чек-листов</p>
                        <span>75%</span>
                    </Flex>
                </Flex>
                <Flex className={styles.ChartContainer}>
                    {
                        chartOptions && chartOptions.map((item, index) => (
                            <ChartContainerItem item={item} key={index} />
                        ))
                    }
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CategoriesStatsWidget;