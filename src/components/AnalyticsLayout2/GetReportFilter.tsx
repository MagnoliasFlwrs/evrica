import React, {useCallback, useMemo, useState} from 'react';
import {Button, Cascader, DatePicker, Flex, notification} from "antd";
import styles from "./AnalyticsLayout2.module.scss";
import dayjs, {type Dayjs} from "dayjs";
import {CascaderOption, Category, SubLocation , Location} from "./types";
import {useAnalyticsStore2} from "../../stores/analyticsStore2";
import {useAuth} from "../../store";
import {useCallsStore} from "../../stores/callsStore";
const { RangePicker } = DatePicker;

interface reportFilterProps  {
    categories: Location[];
}

const GetReportFilter = ({categories}:reportFilterProps) => {
    const getReportTotalData = useAnalyticsStore2((state)=> state.getReportTotalData);
    const setGeneralManagerReportsObj = useAnalyticsStore2((state)=> state.setGeneralManagerReportsObj);
    const reportLoading = useAnalyticsStore2((state)=> state.loading);
    const getManagersList = useAnalyticsStore2((state)=> state.getManagersList);
    const getManagersReport = useAnalyticsStore2((state)=> state.getManagersReport);
    const loading = useCallsStore((state)=>state.loading);

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const user = useAuth((state)=> state.user);

    const isButtonDisabled = useMemo(() => {
        return !dateRange ||
            !dateRange[0] ||
            !dateRange[1] ||
            !selectedCategoryId ||
            !user?.organization_id;
    }, [dateRange, selectedCategoryId, user]);

    const [api, contextHolder] = notification.useNotification();

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


    return (
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
    );
};

export default GetReportFilter;