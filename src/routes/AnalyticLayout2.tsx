import React, {useEffect, useMemo, useState, useCallback, ChangeEvent} from 'react';
import {
    Flex,
    Input,
    DatePicker,
    ConfigProvider,
    Cascader,
    notification,
    Button,
    Radio,
    type RadioChangeEvent, Spin, Empty, Pagination
} from "antd";
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
import {useAnalyticsStore2} from "../stores/analyticsStore2";
import ManagerCard from "../components/AnalyticsLayout2/ManagerCard";
import EmployeeReportHead from "../components/AnalyticsLayout2/EmployeeReportHead";

// Определяем интерфейсы для данных
interface AppointmentsData {
    targeted_communications: number;
    next_contact_assigned: number;
    percentage_of_appointments_made: number;
}

interface DirectionsData {
    targeted_communications: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
}

interface EmployeeReportItem {
    name: string;
    total_calls: number;
    next_contact_assigned: number;
    not_next_contact_assigned: number;
    percentage_of_appointments_made: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
    call_share: number;
    quality: number;
    kpi: number;
}

interface ReportData {
    number_of_appointments_and_calls: AppointmentsData;
    distribution_by_directions: DirectionsData;
    // employee_report: EmployeeReportItem[];
}
interface ManagersReportData {
    items: EmployeeReportItem[];
    total: number;
    total_pages:number;
}

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
    const getReportTotalData = useAnalyticsStore2((state)=> state.getReportTotalData);
    const reportLoading = useAnalyticsStore2((state)=> state.loading);
    const clearReportTotalData = useAnalyticsStore2((state)=> state.clearReportTotalData);
    const clearManagerReportsObj = useAnalyticsStore2((state)=> state.clearManagerReportsObj);
    const setGeneralManagerReportsObj = useAnalyticsStore2((state)=> state.setGeneralManagerReportsObj);
    const getManagersReport = useAnalyticsStore2((state)=> state.getManagersReport);
    const getManagersList = useAnalyticsStore2((state)=> state.getManagersList);
    const reportTotalData = useAnalyticsStore2((state)=> state.reportTotalData) as ReportData | null;
    const managersReportData = useAnalyticsStore2((state)=> state.managersReportData) as ManagersReportData | null;

    // Состояния с правильной типизацией
    const [appointmentsData, setAppointmentData] = useState<AppointmentsData | null>(null);
    const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);
    const [employeeReportData, setEmployeeReportData] = useState<EmployeeReportItem[]>([]);

    const managerReportsObj = useAnalyticsStore2((state) => state.managerReportsObj);

    const setSort = useAnalyticsStore2((state) => state.setSort);
    const setManagers = useAnalyticsStore2((state) => state.setManagers);
    const setPageLimit = useAnalyticsStore2((state) => state.setPageLimit);
    const setPage = useAnalyticsStore2((state) => state.setPage);

    const [totalItemsCount, setTotalItemsCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number | null>(1);
    const [currentLimit, setCurrentLimit] = useState<number | null>(10);

    const handleSortChange = (e: RadioChangeEvent) => {

        setSort(e.target.value);
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };


    useEffect(() => {
        clearReportTotalData();
        clearManagerReportsObj()
    }, []);

    useEffect(()=>{
        if(searchValue.trim().length > 0) {
            setManagers([searchValue.trim()]);
        } else {
            setManagers([]);
        }
    }, [searchValue]);

    useEffect(() => {
        if (currentLimit) {
            setPageLimit(currentLimit);
            setCurrentPage(1);
            setPage(1);
        }
    }, [currentLimit]);

    useEffect(() => {
        if (managerReportsObj.date_from &&
            managerReportsObj.date_to &&
            managerReportsObj.category_id &&
            managerReportsObj.org_id) {

            if (currentPage) {
                setPage(currentPage);
            }
            if (currentLimit) {
                setPageLimit(currentLimit);
            }

            getManagersReport();
        }
    }, [currentPage, currentLimit, managerReportsObj.date_from,
        managerReportsObj.date_to, managerReportsObj.category_id,
        managerReportsObj.org_id, managerReportsObj.sort]);

    const isButtonDisabled = useMemo(() => {
        return !dateRange ||
            !dateRange[0] ||
            !dateRange[1] ||
            !selectedCategoryId ||
            !user?.organization_id;
    }, [dateRange, selectedCategoryId, user]);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        getCallsCategories();
    }, [getCallsCategories]);

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

    const handleGetReport = useCallback(() => {
        if (isButtonDisabled) return;

        const dateFrom = dateRange![0]!.format('YYYY-MM-DD');
        const dateTo = dateRange![1]!.format('YYYY-MM-DD');

        getReportTotalData(dateFrom, dateTo, selectedCategoryId!, user!.organization_id);
        getManagersList(dateFrom, dateTo, selectedCategoryId!, user!.organization_id);
        setGeneralManagerReportsObj(dateFrom, dateTo, selectedCategoryId!, user!.organization_id);
        getManagersReport();
    }, [dateRange, selectedCategoryId, user, getReportTotalData, isButtonDisabled]);

    useEffect(() => {
        if (reportTotalData) {
            setAppointmentData(reportTotalData.number_of_appointments_and_calls);
            setDirectionsData(reportTotalData.distribution_by_directions);
            // setEmployeeReportData(reportData.employee_report);
        }
    }, [reportTotalData]);
    useEffect(() => {
        if (managersReportData) {
            setEmployeeReportData(managersReportData.items);
            setTotalItemsCount(managersReportData.total);
        }
    }, [managersReportData]);


    return (
        <ConfigProvider
            getPopupContainer={() => document.body}
            locale={ruRU}
        >
            {contextHolder}
            <PageContainer style={{marginRight:'20px'}}>
                <Flex vertical gap={20}>
                    <PageTitle text='Аналитика-2'/>
                    <h3>Назначение встречи</h3>
                </Flex>
                <Flex className={styles.AnalyticsControls}>
                    <Flex  gap={20} style={{width:'100%'}}>
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

                        <Button
                            onClick={handleGetReport}
                            loading={reportLoading}
                            type="primary"
                            disabled={isButtonDisabled}
                            style={{
                                opacity: isButtonDisabled ? 0.5 : 1,
                                cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Построить отчет
                        </Button>
                    </Flex>

                </Flex>

                {reportTotalData ? (
                    <Flex vertical gap={20}>
                        <Flex gap={20} style={{marginTop:'30px'}}>
                            <CircledChart data={appointmentsData} type="appointments" />
                            <CircledChart data={directionsData} type="directions" />
                        </Flex>
                        {
                            loading ? (<Spin/> ):
                                <Flex vertical gap={20}>
                                    <Flex gap={30} style={{marginTop:'50px'}} align={'center'}>
                                        <h3>Отчет по сотрудникам</h3>
                                        <Flex className={styles.SortContainer}>
                                            <p>Сортировка по:</p>
                                            <Radio.Group
                                                defaultValue="call_share"
                                                buttonStyle="solid"
                                                onChange={handleSortChange}
                                            >
                                                <Radio.Button value="call_share">Доля звонков</Radio.Button>
                                                <Radio.Button value="quality">Качество</Radio.Button>
                                                <Radio.Button value="kpi">KPI</Radio.Button>
                                            </Radio.Group>
                                        </Flex>
                                        <Flex className={styles.AnalyticsControlsInner}>
                                            <p>Поиск по сотруднику</p>
                                            <Input
                                                prefix={<SearchOutlined style={{ color: '#8C8C8C' }}/>}
                                                className={styles.CategoriesTreeHeadInput}
                                                style={{width: '259px'}}
                                                value={searchValue}
                                                onChange={handleSearchChange}
                                                placeholder="Введите имя сотрудника"
                                                allowClear
                                            />
                                        </Flex>
                                    </Flex>

                                    <Flex vertical gap={20}>
                                        {loading ? (
                                            <Spin/>
                                        ) : (
                                            employeeReportData.length > 0 ? (
                                                <Flex vertical gap={20}>
                                                    <Flex style={{marginTop:'30px', flexWrap:'wrap', rowGap:'40px', columnGap:'20px'}}>
                                                        {employeeReportData.map((item, index) => (
                                                            <ManagerCard key={index} userData={item} />
                                                        ))}
                                                    </Flex>
                                                    <Flex justify="flex-end">
                                                        <Pagination
                                                            showSizeChanger
                                                            onShowSizeChange={(current, size) => {
                                                                setCurrentLimit(size);
                                                            }}
                                                            onChange={(page, pageSize) => {
                                                                setCurrentPage(page);
                                                                setCurrentLimit(pageSize);
                                                            }}
                                                            current={currentPage || 1}
                                                            total={totalItemsCount || 0}
                                                            pageSize={currentLimit || 10}
                                                            pageSizeOptions={['10', '20', '50']}
                                                            showTotal={(total) => `Всего: ${total}`}
                                                        />
                                                    </Flex>
                                                </Flex>
                                            ) : (
                                                <Flex flex={1} justify={'center'} align={'center'}>
                                                    <Empty/>
                                                </Flex>
                                            )
                                        )}
                                    </Flex>
                                </Flex>
                        }
                    </Flex>
                ) :
                    <Flex align={'center'} justify={'center'} flex={1}>
                        <p>Для получения данных выберите категорию и даты</p>
                    </Flex>

                }
            </PageContainer>
        </ConfigProvider>
    );
};

export default AnalyticLayout2;