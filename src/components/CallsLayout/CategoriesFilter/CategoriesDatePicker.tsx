import React, { useState, useEffect } from 'react';
import { Flex } from "antd";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "./CategoriesFilter.module.scss"
import './reactCalendarCustom.css'
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {useCallsStore} from "../../../stores/callsStore";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CategoriesDatePicker = () => {
    const [value, onChange] = useState<Value>(new Date());
    const [activePeriod, setActivePeriod] = useState<string>('today');
    const setCategoryCallsFilterDate = useCallsStore((state) => state.setCategoryCallsFilterDate);

    // Функция для установки времени начала дня (00:00:00)
    const setStartOfDay = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    };

    // Функция для установки времени конца дня (23:59:59)
    const setEndOfDay = (date: Date): Date => {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 999);
        return newDate;
    };

    // Функция для преобразования даты в Unix-формат (секунды)
    const dateToUnix = (date: Date): number => {
        return Math.floor(date.getTime() / 1000);
    };

    // Функция для обновления дат в хранилище
    const updateStoreDates = (startDate: Date, endDate: Date) => {
        const startUnix = dateToUnix(startDate);
        const endUnix = dateToUnix(endDate);
        setCategoryCallsFilterDate(startUnix, endUnix);
    };

    // Обработчик изменения периода
    const handlePeriodClick = (period: string) => {
        setActivePeriod(period);
        const today = new Date();

        switch(period) {
            case 'today':
                const todayStart = setStartOfDay(today);
                const todayEnd = setEndOfDay(today);
                onChange(today);
                updateStoreDates(todayStart, todayEnd);
                break;
            case '7days':
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                const sevenDaysStart = setStartOfDay(sevenDaysAgo);
                const sevenDaysEnd = setEndOfDay(today);
                onChange([sevenDaysAgo, today]);
                updateStoreDates(sevenDaysStart, sevenDaysEnd);
                break;
            case '14days':
                const fourteenDaysAgo = new Date();
                fourteenDaysAgo.setDate(today.getDate() - 14);
                const fourteenDaysStart = setStartOfDay(fourteenDaysAgo);
                const fourteenDaysEnd = setEndOfDay(today);
                onChange([fourteenDaysAgo, today]);
                updateStoreDates(fourteenDaysStart, fourteenDaysEnd);
                break;
            case '30days':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(today.getDate() - 30);
                const thirtyDaysStart = setStartOfDay(thirtyDaysAgo);
                const thirtyDaysEnd = setEndOfDay(today);
                onChange([thirtyDaysAgo, today]);
                updateStoreDates(thirtyDaysStart, thirtyDaysEnd);
                break;
            case 'all':
                const startDate = new Date(2020, 0, 1);
                const allStart = setStartOfDay(startDate);
                const allEnd = setEndOfDay(today);
                onChange([startDate, today]);
                updateStoreDates(allStart, allEnd);
                break;
            default:
                const defaultStart = setStartOfDay(today);
                const defaultEnd = setEndOfDay(today);
                onChange(today);
                updateStoreDates(defaultStart, defaultEnd);
        }
    };

    // Обработчик изменения даты в календаре
    const handleCalendarChange = (newValue: Value) => {
        onChange(newValue);
        setActivePeriod('custom');

        if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
            // Диапазон дат
            const startDate = setStartOfDay(newValue[0]);
            const endDate = setEndOfDay(newValue[1]);
            updateStoreDates(startDate, endDate);
        } else if (newValue instanceof Date) {
            // Одна дата
            const startDate = setStartOfDay(newValue);
            const endDate = setEndOfDay(newValue);
            updateStoreDates(startDate, endDate);
        }
    };

    // Установка начального значения (текущий день)
    useEffect(() => {
        const today = new Date();
        const todayStart = setStartOfDay(today);
        const todayEnd = setEndOfDay(today);
        updateStoreDates(todayStart, todayEnd);
    }, []);

    return (
        <Flex className={styles.CategoriesDatePickerContainer}>
            <Flex className={styles.CalendarInner}>
                <Calendar
                    onChange={handleCalendarChange}
                    value={value}
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
                <Flex
                    className={`${styles.CalendarInnerController} ${activePeriod === 'all' ? styles.active : ''}`}
                    onClick={() => handlePeriodClick('all')}
                >
                    За все время
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CategoriesDatePicker;