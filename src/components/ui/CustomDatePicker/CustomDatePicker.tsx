import React, {useState, useEffect} from 'react';
import {Flex, notification} from "antd";
import styles from "./CustomDatePicker.module.scss";
import {CustomDatePickerProps} from "./types";
import {Calendar} from "react-calendar";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import 'react-calendar/dist/Calendar.css';
import '../../CallsLayout/CategoriesFilter/reactCalendarCustom.css'
import BlueButton from "../BlueButton/BlueButton";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type OnArgs = {
    action: string;
    activeStartDate: Date | null;
    value: Value;
    view: string;
};

const CustomDatePicker = ({
                              openCustomDatePicker,
                              setOpenCustomDatePicker,
                              selectedDate,
                              onDateChange
                          }: CustomDatePickerProps) => {
    const [value, onChange] = useState<Value>(selectedDate || new Date());
    const [activeStartDate, setActiveStartDate] = useState<Date>(new Date()); // Для управления отображением календаря
    const [activePeriod, setActivePeriod] = useState<string>('all');
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (selectedDate) {
            onChange(selectedDate);
        }
    }, [selectedDate]);

    // Функция для проверки, превышает ли период 30 дней
    const isPeriodOver30Days = (startDate: Date, endDate: Date): boolean => {
        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference > 30;
    };

    // Функция для отображения уведомления
    const showNotification = () => {
        api.warning({
            message: 'Ограничение периода',
            description: 'Можно выбрать период не более 30 дней. Период установлен на текущую дату.',
            placement: 'bottom',
            duration: 3,
        });
    };

    const setStartOfDay = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    };

    const setEndOfDay = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 999);
        return newDate;
    };

    const handleApply = () => {
        if (Array.isArray(value) && value[0] && value[1]) {
            if (isPeriodOver30Days(value[0], value[1])) {
                showNotification();

                // Устанавливаем текущую дату
                const today = new Date();
                onChange(today);
                setActiveStartDate(today);
                setActivePeriod('today');

                onDateChange?.(today);
                setOpenCustomDatePicker(false);
                return;
            }
        }

        onDateChange?.(value);
        setOpenCustomDatePicker(false);
    };

    const handleCalendarChange = (newValue: Value) => {
        onChange(newValue);

        // Проверяем, является ли выбор диапазоном дат
        if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
            // Проверяем, не превышает ли период 30 дней
            if (isPeriodOver30Days(newValue[0], newValue[1])) {
                // Показываем уведомление
                showNotification();

                // Устанавливаем текущую дату
                const today = new Date();

                onChange(today);
                setActiveStartDate(today);
                setActivePeriod('today');
            } else {

                setActivePeriod('custom');
                setActiveStartDate(newValue[0]);
            }
        } else if (newValue instanceof Date) {

            setActivePeriod('custom');

            setActiveStartDate(newValue);
        }
    };

    const handlePeriodClick = (period: string) => {
        setActivePeriod(period);
        const today = new Date();
        setActiveStartDate(today);

        switch(period) {
            case 'today':
                onChange(today);
                break;
            case '7days':
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                onChange([sevenDaysAgo, today]);
                break;
            case '14days':
                const fourteenDaysAgo = new Date();
                fourteenDaysAgo.setDate(today.getDate() - 14);
                onChange([fourteenDaysAgo, today]);
                break;
            case '30days':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(today.getDate() - 30);
                onChange([thirtyDaysAgo, today]);
                break;
            default:
                onChange(today);
        }
    };

    const handleActiveStartDateChange = ({ activeStartDate }: OnArgs) => {
        if (activeStartDate) {
            setActiveStartDate(activeStartDate);
        }
    };

    useEffect(() => {
        const today = new Date();
        setActiveStartDate(today);
    }, []);

    return (
        <>
            {contextHolder}
            <Flex className={styles.CustomDatePicker}>
                <Flex vertical className={styles.CalendarInnerControllers}>
                    <Flex
                        className={`${styles.CalendarInnerController} ${activePeriod === 'today' ? styles.active : ''}`}
                        onClick={() => handlePeriodClick('today')}
                    >
                        Сегодня
                    </Flex>
                    <Flex
                        className={`${styles.CalendarInnerController} ${activePeriod === '7days' ? styles.active : ''}`}
                        onClick={() => handlePeriodClick('7days')}
                    >
                        Последние 7 дней
                    </Flex>
                    <Flex
                        className={`${styles.CalendarInnerController} ${activePeriod === '14days' ? styles.active : ''}`}
                        onClick={() => handlePeriodClick('14days')}
                    >
                        Последние 14 дней
                    </Flex>
                    <Flex
                        className={`${styles.CalendarInnerController} ${activePeriod === '30days' ? styles.active : ''}`}
                        onClick={() => handlePeriodClick('30days')}
                    >
                        Последние 30 дней
                    </Flex>
                </Flex>

                <Flex className={styles.CustomDatePickerCalendarInner}>
                    <Flex className={styles.CalendarInner}>
                        <Calendar
                            onChange={handleCalendarChange}
                            value={value}
                            activeStartDate={activeStartDate}
                            onActiveStartDateChange={handleActiveStartDateChange}
                            showNeighboringMonth={true}
                            prevLabel={<LeftOutlined/>}
                            nextLabel={<RightOutlined/>}
                            allowPartialRange={true}
                            selectRange={true}
                            className={styles.CustomCalendar}
                            next2Label={null}
                            prev2Label={null}
                        />
                    </Flex>

                    <Flex className={styles.ButtonInner}>
                        <BlueButton
                            text='Применить'
                            onClick={handleApply}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
};
export default CustomDatePicker;