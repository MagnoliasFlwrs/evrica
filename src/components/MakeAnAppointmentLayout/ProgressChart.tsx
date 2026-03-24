import React from 'react';
import {Flex, Progress} from "antd";
import styles from './AnalyticsLayout2.module.scss'

interface AppointmentsData {
    targeted_communications: number;
    next_contact_assigned: number;
    percentage_of_appointments_made: number;
}
interface ChartProps {
    data: AppointmentsData | null;
}

const ProgressChart = ({data}:ChartProps) => {



    return (
        <Flex className={styles.ProgressChart}>
            <Progress
                type="circle"
                percent={data?.percentage_of_appointments_made}
                format={(percent) => `${percent}%`}
                className={styles.CustomProgress}
                strokeColor='#007AFF'
                trailColor='rgba(0, 122, 255, 0.15)'
                strokeWidth={12}
                size={120}
                // showInfo={false}
            />
            <Flex className={styles.infoBlock}>
                <div className={styles.infoRow}>
                    <span>Целевых коммуникаций:</span>
                    <strong>{data?.targeted_communications.toLocaleString()}</strong>
                </div>
                <div className={styles.infoRow}>
                    <span>Следующий контакт назначен:</span>
                    <strong >
                        {data?.next_contact_assigned.toLocaleString()}
                    </strong>
                </div>
                <div className={styles.infoRow}>
                    <span>Процент назначенных встреч:</span>
                    <strong >
                        {data?.percentage_of_appointments_made}%
                    </strong>
                </div>
            </Flex>
        </Flex>
    );
};

export default ProgressChart;