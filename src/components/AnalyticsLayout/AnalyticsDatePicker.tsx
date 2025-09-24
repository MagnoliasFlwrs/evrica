import React, { useState } from 'react';
import { Flex } from "antd";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import styles from "../CallsLayout/CategoriesFilter/CategoriesFilter.module.scss"
import '../CallsLayout/CategoriesFilter/reactCalendarCustom.css'
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CategoriesDatePicker = () => {
    const [value, onChange] = useState<Value>(new Date());
    const [activePeriod, setActivePeriod] = useState<string>('all');


    const handlePeriodClick = (period: string) => {
        setActivePeriod(period);
        const today = new Date();

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
            case 'all':
                // Установите начальную дату по вашему усмотрению
                const startDate = new Date(2020, 0, 1); // 1 января 2020
                onChange([startDate, today]);
                break;
            default:
                onChange(today);
        }
    };

    return (
        <Flex className={styles.CategoriesDatePickerContainer}>
            <Flex className={styles.CalendarInner}>
                <Calendar
                    onChange={onChange}
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