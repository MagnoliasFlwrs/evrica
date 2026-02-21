import React, {useState, useMemo, ChangeEvent, useEffect} from 'react';
import {Flex, Input, Checkbox, Button} from "antd";
import styles from "./AnalyticsLayout2.module.scss";
import CloseIcon from "../ui/CustomSelect/icons/CloseIcon";
import { useAnalyticsStore2 } from "../../stores/analyticsStore2";
import { SearchOutlined } from "@ant-design/icons";

interface FilterModalProps {
    setIsOpenFilterModal:(isOpen:boolean)=>void;
    setIsActiveFilter:(isActive:boolean)=>void;
}

const FilterModal= ({setIsOpenFilterModal, setIsActiveFilter}:FilterModalProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
    const [objManagersState, setObjManagersState] = useState<string[]>([]);

    const managersList = useAnalyticsStore2((state) => state.managersList) as string[] || [];
    const setManagers = useAnalyticsStore2((state) => state.setManagers);
    const managerReportsObj = useAnalyticsStore2((state) => state.managerReportsObj);

    // Инициализируем selectedManagers из objManagersState при монтировании
    useEffect(() => {
        if (managerReportsObj.managers && managerReportsObj.managers.length > 0) {
            setSelectedManagers(managerReportsObj.managers);
            // Также устанавливаем флаг активности фильтра, если есть выбранные менеджеры
            if (managerReportsObj.managers.length > 0) {
                setIsActiveFilter(true);
            }
        }
    }, [managerReportsObj.managers, setIsActiveFilter]);

    // Обновляем objManagersState при изменении managerReportsObj.managers
    useEffect(() => {
        setObjManagersState(managerReportsObj.managers || []);
    }, [managerReportsObj.managers]);

    // Фильтруем менеджеров по поиску
    const filteredManagers = useMemo((): string[] => {
        if (!searchValue.trim()) {
            return managersList;
        }

        const searchLower = searchValue.toLowerCase();
        return managersList.filter((manager: string) =>
            manager.toLowerCase().includes(searchLower)
        );
    }, [managersList, searchValue]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchValue(e.target.value);
    };

    const handleManagerToggle = (manager: string): void => {
        setSelectedManagers((prev: string[]) => {
            if (prev.includes(manager)) {
                return prev.filter((m: string) => m !== manager);
            } else {
                return [...prev, manager];
            }
        });
    };

    const handleClose = (): void => {
        setIsOpenFilterModal(false)
    }

    const handleSubmitFilter = (): void => {
        if(selectedManagers.length > 0) {
            setManagers(selectedManagers)
            setIsActiveFilter(true)
        } else {
            setManagers([])
            setIsActiveFilter(false)
        }
        setIsOpenFilterModal(false)
    }

    const handleClearFilter = () => {
        setManagers([])
        setIsActiveFilter(false)
        setSelectedManagers([])
        setIsOpenFilterModal(false)
    }

    const isSubmitDisabled = selectedManagers.length === 0;

    return (
        <Flex className={styles.filterModalOverlay}>
            <Flex className={styles.filterModal}>
                <Flex className={styles.filterModalClose}>
                <span className={styles.filterModalCloseIcon} onClick={handleClose}>
                    <CloseIcon/>
                </span>
                </Flex>

                <Flex className={styles.filterModalContent}>
                    <Flex className={styles.filterModalContentControls}>
                        <Input
                            prefix={<SearchOutlined style={{ color: '#8C8C8C' }}/>}
                            className={styles.CategoriesTreeHeadInput}
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder="Введите имя сотрудника"
                            allowClear
                        />
                    </Flex>

                    <Flex className={styles.filterModalCheckBoxList}>
                        {filteredManagers.length > 0 ? (
                            filteredManagers.map((manager: string) => (
                                <Checkbox
                                    key={manager}
                                    className={styles.filterModalCheckbox}
                                    checked={selectedManagers.includes(manager)}
                                    onChange={() => handleManagerToggle(manager)}
                                >
                                    {manager}
                                </Checkbox>
                            ))
                        ) : (
                            <div className={styles.filterModalEmpty}>
                                Сотрудники не найдены
                            </div>
                        )}
                    </Flex>

                    <Button
                        onClick={handleSubmitFilter}
                        disabled={isSubmitDisabled}
                        type="primary"
                        className={styles.submitButton}
                    >
                        Применить
                    </Button>
                    <span className={styles.clear} onClick={handleClearFilter}>
                        Сбросить фильтр
                    </span>
                </Flex>
            </Flex>
        </Flex>

    );
};

export default FilterModal;