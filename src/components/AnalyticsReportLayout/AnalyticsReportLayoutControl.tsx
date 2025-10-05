import React from 'react';
import {Value} from "../ui/CustomDatePicker/types";
import {Flex} from "antd";
import styles from "../CallsFilteredLayout/CallsFilteredLayout.module.scss";
import CustomDatePicker from "../ui/CustomDatePicker/CustomDatePicker";
import BlueButton from "../ui/BlueButton/BlueButton";

interface AnalyticsReportLayoutControlProps {
    openCustomDatePicker: boolean;
    setOpenCustomDatePicker: (open: boolean) => void;
    selectedDate: Value;
    onDateChange: (date: Value) => void;
}


const AnalyticsReportLayoutControl = ({
                                        openCustomDatePicker,
                                        setOpenCustomDatePicker,
                                        selectedDate,
                                        onDateChange
                                    }: AnalyticsReportLayoutControlProps) => {

    const formatDateRange = (date: Value): string => {
        if (!date) return 'Выберите период';

        if (Array.isArray(date) && date[0] && date[1]) {
            return `${formatDate(date[0])} - ${formatDate(date[1])}`;
        }

        if (date instanceof Date) {
            return formatDate(date);
        }

        return 'Выберите период';
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    return (
        <Flex className={styles.CallsFilteredLayoutControl}>
            <Flex className={styles.CallsFilteredLayoutControlCategory}>
                <Flex className={styles.CallsFilteredLayoutControlCategoryCounter}>
                    <span>4</span>
                </Flex>
                <p>Категорий выбрано</p>
            </Flex>

            <Flex className='custom-datepicker-container'>
                <p
                    className={styles.CallsFilteredLayoutControlPeriod}
                    onClick={() => setOpenCustomDatePicker(!openCustomDatePicker)}
                    style={{ cursor: 'pointer' }}
                >
                    {formatDateRange(selectedDate)}
                </p>

                {openCustomDatePicker && (
                    <CustomDatePicker
                        openCustomDatePicker={openCustomDatePicker}
                        setOpenCustomDatePicker={setOpenCustomDatePicker}
                        selectedDate={selectedDate}
                        onDateChange={onDateChange}
                    />
                )}
            </Flex>

            <BlueButton
                text='Изменить параметры'
                className={styles.CallsFilteredLayoutControlButton}
            />
        </Flex>
    );
};
export default AnalyticsReportLayoutControl;