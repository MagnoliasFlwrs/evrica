import React, { useEffect, useMemo, useState } from 'react';
import { Flex } from 'antd';
import dayjs from 'dayjs';
import {useAnalyticsStore2} from "../../stores/analyticsStore2";
import {useAuth} from "../../store";
import {useCallsStore} from "../../stores/callsStore";
import CategoriesFilter from '../CallsLayout/CategoriesFilter/CategoriesFilter';
import filteredCallsStyles from '../CallsLayout/FilteredCallsBlock/FilteredCallsBlock.module.scss';

const GetReportFilter = () => {
    const getReportTotalData = useAnalyticsStore2((state)=> state.getReportTotalData);
    const setGeneralManagerReportsObj = useAnalyticsStore2((state)=> state.setGeneralManagerReportsObj);
    const reportLoading = useAnalyticsStore2((state)=> state.loading);
    const getManagersList = useAnalyticsStore2((state)=> state.getManagersList);
    const managersReportData = useAnalyticsStore2((state)=> state.managersReportData);
    const categoryCallsListObj = useCallsStore((state) => state.categoryCallsListObj);
    const user = useAuth((state)=> state.user);
    const [isSelected, setIsSelected] = useState(0);

    const selectedCategoryId = categoryCallsListObj?.category_id;
    const dateStart = categoryCallsListObj?.date_start;
    const dateEnd = categoryCallsListObj?.date_end;

    const isFiltersReady = useMemo(() => {
        return !dateStart ||
            !dateEnd ||
            !selectedCategoryId ||
            !user?.organization_id;
    }, [dateEnd, dateStart, selectedCategoryId, user]);

    const foundCount = useMemo(() => {
        if (!managersReportData || Array.isArray(managersReportData) || typeof managersReportData !== 'object') {
            return 0;
        }

        const total = (managersReportData as { total?: number }).total;
        return typeof total === 'number' ? total : 0;
    }, [managersReportData]);

    useEffect(() => {
        if (!isSelected || isFiltersReady) {
            return;
        }

        const dateFrom = dayjs.unix(Number(dateStart)).format('YYYY-MM-DD');
        const dateTo = dayjs.unix(Number(dateEnd)).format('YYYY-MM-DD');
        const normalizedCategoryId = Number(selectedCategoryId);

        if (!Number.isFinite(normalizedCategoryId) || !user?.organization_id) {
            return;
        }

        getReportTotalData(dateFrom, dateTo, normalizedCategoryId, user.organization_id);
        getManagersList(dateFrom, dateTo, normalizedCategoryId, user.organization_id);
        setGeneralManagerReportsObj(dateFrom, dateTo, normalizedCategoryId, user.organization_id);
    }, [
        dateEnd,
        dateStart,
        getManagersList,
        getReportTotalData,
        isFiltersReady,
        isSelected,
        selectedCategoryId,
        setGeneralManagerReportsObj,
        user,
    ]);


    return (
        <Flex vertical gap={20} style={{width:'100%'}}>
            <CategoriesFilter setIsSelected={setIsSelected} />
            <Flex className={filteredCallsStyles.FilteredCallsBlock}>
                {
                    isSelected > 0 ? (
                        <Flex className={filteredCallsStyles.SelectedCalls}>
                            <p>Найдено {reportLoading ? '...' : foundCount} сотрудников</p>
                        </Flex>
                    ) : (
                        <p>Для просмотра отчета необходимо выбрать категорию</p>
                    )
                }
            </Flex>
        </Flex>
    );
};

export default GetReportFilter;