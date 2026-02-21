import React, { useState, useEffect, ChangeEvent } from 'react';
import { Flex, Input, Radio } from "antd";
import type { RadioChangeEvent } from 'antd';
import styles from "./AnalyticsLayout2.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useAnalyticsStore2 } from "../../stores/analyticsStore2";
import Filter from "../../icons/Filter";

interface EmployeeReportHeadProps {
    setIsOpenFilterModal: (isOpen: boolean) => void;
    isActiveFilter: boolean;
}

const EmployeeReportHead= ({
                                                                   setIsOpenFilterModal,
                                                                    isActiveFilter
                                                               }:EmployeeReportHeadProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const setSort = useAnalyticsStore2((state) => state.setSort);
    const setManagers = useAnalyticsStore2((state) => state.setManagers);

    const handleSortChange = (e: RadioChangeEvent): void => {
        setSort(e.target.value);
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setSearchValue(value);
    };

    useEffect((): void => {
        if(searchValue.trim().length > 0) {
            setManagers([searchValue.trim()]);
        } else {
            setManagers([]);
        }
    }, [searchValue, setManagers]);

    const handleOpenFilterModal = (): void => {
        setIsOpenFilterModal(true);
    }

    const filterIconClass = `${styles.FilterIcon} ${isActiveFilter  ? styles.active : ''}`;

    return (
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
            <Flex className={styles.AnalyticsControlsInner}>
                <p>Фильтрация</p>
                <span
                    className={filterIconClass}
                    onClick={handleOpenFilterModal}
                >
                   <Filter/>
                </span>
            </Flex>
        </Flex>
    );
};

export default EmployeeReportHead;