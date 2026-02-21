import React, {useEffect, useState, ChangeEvent} from 'react';
import {
    Flex,
    ConfigProvider,
    notification,
    Spin, Empty, Pagination
} from "antd";

import PageContainer from "../components/ui/PageContainer/PageContainer";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import styles from "../components/AnalyticsLayout2/AnalyticsLayout2.module.scss";
import ruRU from "antd/locale/ru_RU";
import {useCallsStore} from "../stores/callsStore";
import CircledChart from "../components/AnalyticsLayout2/CircledChart";
import {useAnalyticsStore2} from "../stores/analyticsStore2";
import ManagerCard from "../components/AnalyticsLayout2/ManagerCard";
import GetReportFilter from "../components/AnalyticsLayout2/GetReportFilter";
import {
    AppointmentsData,
    DirectionsData,
    EmployeeReportItem,
    ManagersReportData,
    ReportData, Location
} from "../components/AnalyticsLayout2/types";
import EmployeeReportHead from "../components/AnalyticsLayout2/EmployeeReportHead";
import FilterModal from "../components/AnalyticsLayout2/FilterModal";


const AnalyticLayout2 = () => {
    const getCallsCategories = useCallsStore((state)=>state.getCallsCategories);
    const loading = useCallsStore((state)=>state.loading);
    const callsCategories = useCallsStore((state) => state.callsCategories);
    const [categories, setCategories] = useState<Location[]>([]);

    const [api, contextHolder] = notification.useNotification();

    const clearReportTotalData = useAnalyticsStore2((state)=> state.clearReportTotalData);
    const clearManagerReportsObj = useAnalyticsStore2((state)=> state.clearManagerReportsObj);

    const getManagersReport = useAnalyticsStore2((state)=> state.getManagersReport);

    const reportTotalData = useAnalyticsStore2((state)=> state.reportTotalData) as ReportData | null;
    const managersReportData = useAnalyticsStore2((state)=> state.managersReportData) as ManagersReportData | null;

    // Состояния с правильной типизацией
    const [appointmentsData, setAppointmentData] = useState<AppointmentsData | null>(null);
    const [directionsData, setDirectionsData] = useState<DirectionsData | null>(null);
    const [employeeReportData, setEmployeeReportData] = useState<EmployeeReportItem[]>([]);

    const managerReportsObj = useAnalyticsStore2((state) => state.managerReportsObj);
    const setPageLimit = useAnalyticsStore2((state) => state.setPageLimit);
    const setPage = useAnalyticsStore2((state) => state.setPage);

    const [totalItemsCount, setTotalItemsCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number | null>(1);
    const [currentLimit, setCurrentLimit] = useState<number | null>(10);

    const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);
    const [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);

    // useEffect(() => {
    //     clearReportTotalData();
    //     clearManagerReportsObj()
    // }, []);

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
        managerReportsObj.org_id, managerReportsObj.sort, managerReportsObj.managers]);



    useEffect(() => {
        getCallsCategories();
    }, [getCallsCategories]);

    useEffect(()=> {
        if (callsCategories && Array.isArray(callsCategories)) {
            setCategories(callsCategories as Location[]);
        }
    }, [callsCategories]);


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
                    <GetReportFilter categories={categories}/>
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
                                    <EmployeeReportHead
                                        setIsOpenFilterModal={setIsOpenFilterModal}
                                        isActiveFilter={isActiveFilter}
                                    />

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
                {
                    isOpenFilterModal && <FilterModal setIsOpenFilterModal={setIsOpenFilterModal} setIsActiveFilter={setIsActiveFilter}/>
                }

            </PageContainer>
        </ConfigProvider>
    );
};

export default AnalyticLayout2;