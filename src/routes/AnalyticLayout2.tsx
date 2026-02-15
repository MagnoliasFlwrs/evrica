import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {Flex, Input, DatePicker, ConfigProvider, Cascader, notification, Button} from "antd";
import type {CascaderProps} from 'antd';
import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import { SearchOutlined } from "@ant-design/icons";
import styles from "../components/AnalyticsLayout2/AnalyticsLayout2.module.scss";
import ruRU from "antd/locale/ru_RU";
import {useCallsStore} from "../stores/callsStore";
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {useAuth} from "../store";
import CircledChart from "../components/AnalyticsLayout2/CircledChart";
import EmployeeLineCharts from "../components/AnalyticsLayout2/EmployeeLineCharts";

const { RangePicker } = DatePicker;

interface Category {
    id: number;
    name: string;
    description: string;
    channel_one_name: string;
    channel_two_name: string;
    trigger_limit_min: string;
    trigger_limit_max: string;
    last_indexed_file: null | string;
    who_delete: null | string;
    created_at: null | string;
    updated_at: null | string;
    deleted_at: null | string;
    agents: any[];
}

interface SubLocation {
    id: number;
    location_id: number;
    name: string;
    description: string;
    categories: Category[];
}

interface Location {
    id: number;
    name: string;
    description: string;
    sub_locations: SubLocation[];
}

interface CascaderOption {
    value: number;
    label: string;
    children?: CascaderOption[];
    disabled?: boolean;
}

const AnalyticLayout2 = () => {
    const [searchValue, setSearchValue] = useState("");
    const getCallsCategories = useCallsStore((state)=>state.getCallsCategories);
    const loading = useCallsStore((state)=>state.loading);
    const callsCategories = useCallsStore((state) => state.callsCategories);
    const [categories, setCategories] = useState<Location[]>([]);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const user = useAuth((state)=> state.user);
    // const [appointmentsData , setAppointmentsData] = [];
    // const [directionsData , setDirectionsData] = [];

    const appointmentsData = {
        "targeted_communications": 4265,
        "next_contact_assigned": 3001,
        "percentage_of_appointments_made": 70
    };

    const directionsData = {
        "targeted_communications": 4265,
        "meeting": 106,
        "call_or_messenger": 2246,
        "not_defined": 1859
    };
    const employee_report = [
        {
            "name": "Иоскевич Артем",
            "total_calls": 107,
            "next_contact_assigned": 92,
            "not_next_contact_assigned": 15,
            "percentage_of_appointments_made": 6,
            "meeting": 7,
            "call_or_messenger": 57,
            "not_defined": 43,
            "call_share": 0.025,
            "quality": 0.065,
            "kpi": 0.073
        },
        {
            "name": "Гарновская Юлия",
            "total_calls": 148,
            "next_contact_assigned": 104,
            "not_next_contact_assigned": 44,
            "percentage_of_appointments_made": 4,
            "meeting": 6,
            "call_or_messenger": 68,
            "not_defined": 73,
            "call_share": 0.035,
            "quality": 0.041,
            "kpi": 0.051
        },

        {
            "name": "Шейко Евгения",
            "total_calls": 9,
            "next_contact_assigned": 2,
            "not_next_contact_assigned": 7,
            "percentage_of_appointments_made": 0,
            "meeting": 0,
            "call_or_messenger": 2,
            "not_defined": 7,
            "call_share": 0.002,
            "quality": 0,
            "kpi": 0.001
        },
        {
            "name": "Зайцева Татьяна",
            "total_calls": 3,
            "next_contact_assigned": 3,
            "not_next_contact_assigned": 0,
            "percentage_of_appointments_made": 0,
            "meeting": 0,
            "call_or_messenger": 1,
            "not_defined": 2,
            "call_share": 0.001,
            "quality": 0,
            "kpi": 0
        }
    ]

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        getCallsCategories()
    }, []);

    useEffect(()=> {
        if (callsCategories && Array.isArray(callsCategories)) {
            setCategories(callsCategories as Location[]);
        }
    }, [callsCategories]);

    const cascaderOptions = useMemo((): CascaderOption[] => {
        if (!categories || !Array.isArray(categories)) return [];

        return categories.map((location: Location) => ({
            value: location.id,
            label: location.name,
            children: location.sub_locations?.map((subLocation: SubLocation) => ({
                value: subLocation.id,
                label: subLocation.name,
                children: subLocation.categories?.map((category: Category) => ({
                    value: category.id,
                    label: category.name
                }))
            }))
        }));
    }, [categories]);

    const handleDateRangeChange = useCallback((dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            const daysDiff = dates[1].diff(dates[0], 'day');

            if (daysDiff > 60) {
                api.error({
                    message: 'Ошибка выбора периода',
                    description: 'Выбранный период не может превышать 60 дней',
                    duration: 3,
                });
                return;
            }
            setDateRange(dates);
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
        } else {
            setDateRange(dates);
        }
    }, [api]);

    const handleCategoryChange = useCallback((value: number[], selectedOptions: any) => {
        if (value && value.length === 3) {
            const categoryId = value[2];
            setSelectedCategoryId(categoryId);
        } else {
            setSelectedCategoryId(null);
        }
    }, []);

    return (
        <ConfigProvider
            getPopupContainer={() => document.body}
            locale={ruRU}
        >
            {contextHolder}
            <PageContainer>
                <Flex vertical gap={20}>
                    <PageTitle text='Аналитика-2'/>
                    <h3>Назначение встречи</h3>
                </Flex>
                <Flex className={styles.AnalyticsControls}>
                    <Flex vertical gap={20}>
                        <Flex className={styles.AnalyticsControlsInner} gap={20}>
                            <p>Диапазон дат</p>
                            <RangePicker
                                onChange={handleDateRangeChange}
                                value={dateRange}
                                style={{ width: '300px' }}
                                disabledDate={(current) => {
                                    return current && current > dayjs().endOf('day');
                                }}
                                ranges={{
                                    'Последние 7 дней': [dayjs().subtract(7, 'day'), dayjs()],
                                    'Последние 30 дней': [dayjs().subtract(30, 'day'), dayjs()],
                                    'Последние 60 дней': [dayjs().subtract(60, 'day'), dayjs()],
                                }}
                            />
                        </Flex>
                        <Flex className={styles.AnalyticsControlsInner} gap={20}>
                            <p>Выберите категорию</p>
                            <Cascader
                                placeholder="Выберите категорию"
                                options={cascaderOptions}
                                onChange={handleCategoryChange}
                                loading={loading}
                                allowClear
                                style={{ width: '300px' }}
                                expandTrigger="hover"
                                displayRender={(label) => label.join(' / ')}
                            />
                        </Flex>
                        <Button>Построить отчет</Button>
                    </Flex>

                    <Flex className={styles.AnalyticsControlsInner}>
                        <p>Поиск по сотруднику</p>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#8C8C8C' }}/>}
                            className={styles.CategoriesTreeHeadInput}
                            style={{width: '259px'}}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </Flex>
                </Flex>

                <Flex gap={20} style={{marginTop:'30px'}}>
                    <CircledChart data={appointmentsData} type="appointments" />
                    <CircledChart data={directionsData} type="directions" />
                </Flex>
                <h3 style={{marginTop:'50px'}}>Отчет по сотрудникам</h3>
                <Flex gap={20} style={{marginTop:'30px', flexWrap:'wrap' }}>

                    {
                        employee_report.map((item, index) => (<EmployeeLineCharts key={index} userData={item} />))
                    }
                </Flex>

            </PageContainer>
        </ConfigProvider>
    );
};

export default AnalyticLayout2;