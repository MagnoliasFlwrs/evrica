import React, {useEffect, useLayoutEffect} from 'react';
import ruRU from "antd/locale/ru_RU";
import PageContainer from "../components/ui/PageContainer/PageContainer";
import { Breadcrumb, ConfigProvider, Flex, notification } from "antd";
import PageTitle from "../components/ui/PageTitle/PageTitle";
import styles from "../components/MakeAnAppointmentLayout/AnalyticsLayout2.module.scss";
import ClientPortraitFilters from "../components/ClientPortrait/ClientPortraitFilters";
import ClientPortraitCallsSummary from "../components/ClientPortrait/ClientPortraitCallsSummary";
import ClientPortraitAgeBreakdown from "../components/ClientPortrait/ClientPortraitAgeBreakdown";
import ClientPortraitChart from "../components/ClientPortrait/ClientPortraitChart";
import { useDashboardStore } from "../stores/dashboardStore";


const ClientPortraitLayout = () => {
    const [, contextHolder] = notification.useNotification();
    const clientPortrait = useDashboardStore((state) => state.clientPortrait);
    const portraitLoading = useDashboardStore((state) => state.loading);
    const resetClientPortrait = useDashboardStore((state) => state.resetClientPortrait);
    const showPortraitCharts = clientPortrait != null && !portraitLoading;


    useEffect(() => {
        resetClientPortrait();
    }, []);

    return (
        <ConfigProvider
            getPopupContainer={() => document.body}
            locale={ruRU}
        >
            {contextHolder}
            <PageContainer style={{marginRight:'20px'}}>
                <Breadcrumb
                    style={{marginBottom:'20px'}}
                    items={[
                        {
                            title: <a href="/reports">Отчеты</a>,
                        },
                        {
                            title: 'Портрет клиента',
                        },
                    ]}
                />
                <Flex vertical gap={20}>
                    <PageTitle text='Портрет клиента'/>
                </Flex>
                <Flex vertical gap={24} className={styles.AnalyticsControls}>
                    <ClientPortraitFilters />
                    {showPortraitCharts ? (
                        <>
                            <ClientPortraitCallsSummary />
                            <ClientPortraitChart />
                            <ClientPortraitAgeBreakdown />
                        </>
                    ) : null}
                </Flex>




            </PageContainer>
        </ConfigProvider>
    );
};

export default ClientPortraitLayout;