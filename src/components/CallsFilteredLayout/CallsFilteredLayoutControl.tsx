import React from 'react';
import {Flex} from "antd";
import styles from "./CallsFilteredLayout.module.scss";
import BlueButton from "../ui/BlueButton/BlueButton";
import { Value} from "../ui/CustomDatePicker/types";
import CustomDatePicker from "../ui/CustomDatePicker/CustomDatePicker";
import {useCallsStore} from "../../stores/callsStore";

interface CallsFilteredLayoutControlProps {
    openCustomDatePicker: boolean;
    setOpenCustomDatePicker: (open: boolean) => void;
    selectedDate: Value;
    onDateChange: (date: Value) => void;
}

const CallsFilteredLayoutControl = ({
                                        openCustomDatePicker,
                                        setOpenCustomDatePicker,
                                        selectedDate,
                                        onDateChange
                                    }: CallsFilteredLayoutControlProps) => {
    const setCategoryCallsFilterDate = useCallsStore((state) => state.setCategoryCallsFilterDate);

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

    const handleApplyDates = () => {
        if (selectedDate && Array.isArray(selectedDate) && selectedDate[0] && selectedDate[1]) {
            // Диапазон дат
            const startTimestamp = Math.floor(selectedDate[0].getTime() / 1000);
            const endTimestamp = Math.floor(selectedDate[1].getTime() / 1000);
            setCategoryCallsFilterDate(startTimestamp, endTimestamp);
        } else if (selectedDate instanceof Date) {
            // Одна дата - устанавливаем начало и конец дня
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0); // 00:00:00

            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999); // 23:59:59.999

            const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
            const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

            setCategoryCallsFilterDate(startTimestamp, endTimestamp);
        }
    };

    return (
        <Flex className={styles.CallsFilteredLayoutControl}>
            <Flex className={styles.CallsFilteredLayoutControlCategory}>
                <Flex className={styles.CallsFilteredLayoutControlCategoryCounter}>
                    <span>1</span>
                </Flex>
                <p>Категория выбрана</p>
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
                onClick={handleApplyDates}
            />
        </Flex>
    );
};
export default CallsFilteredLayoutControl;