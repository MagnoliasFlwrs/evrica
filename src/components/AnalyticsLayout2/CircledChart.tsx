import React, { useRef, useEffect } from 'react';
import { Flex } from "antd";
import Chart from 'chart.js/auto';
import styles from "./AnalyticsLayout2.module.scss";

// Типы для данных
interface AppointmentsData {
    targeted_communications: number;
    next_contact_assigned: number;
    percentage_of_appointments_made: number;
}

interface DirectionsData {
    targeted_communications: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
}

type ChartData = AppointmentsData | DirectionsData;

interface CircledChartProps {
    data: ChartData | null;
    type?: 'appointments' | 'directions';
}

const CircledChart: React.FC<CircledChartProps> = ({ data, type = 'appointments' }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (!data || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        if (type === 'appointments') {
            // Для данных о встречах
            const appointmentsData = data as AppointmentsData;
            const total = appointmentsData.targeted_communications;
            const assigned = appointmentsData.next_contact_assigned;
            const remaining = total - assigned;

            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Назначен следующий контакт', 'Остальные'],
                    datasets: [{
                        data: [assigned, remaining],
                        backgroundColor: ['#52c41a', '#f0f0f0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    // cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw as number;
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            // Для данных по направлениям
            const directionsData = data as DirectionsData;
            const total = directionsData.targeted_communications;
            const chartData = [
                directionsData.meeting,
                directionsData.call_or_messenger,
                directionsData.not_defined
            ];

            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Встречи', 'Звонки/Мессенджеры', 'Не определено'],
                    datasets: [{
                        data: chartData,
                        backgroundColor: ['#fa8c16', '#eb2f96', '#bfbfbf'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    // cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw as number;
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${context.label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, type]);

    if (!data) {
        return (
            <Flex className={styles.CircledChart} justify="center" align="center">
                <p>Нет данных для отображения</p>
            </Flex>
        );
    }

    return (
        <Flex className={styles.CircledChart} vertical>
            <h3 className={styles.chartTitle}>
                {type === 'appointments'
                    ? 'Статистика назначенных контактов'
                    : 'Распределение по направлениям'
                }
            </h3>

            <div className={styles.chartContainer}>
                <canvas ref={chartRef} />
            </div>

            <div className={styles.infoBlock}>
                <div className={styles.infoSection}>
                    <div className={styles.infoRow}>
                        <span>Целевых коммуникаций:</span>
                        <strong>{data.targeted_communications.toLocaleString()}</strong>
                    </div>
                </div>

                <div className={styles.infoSection}>

                    {type === 'appointments' && (
                        <>
                            <div className={styles.infoRow}>
                                <span>Следующий контакт назначен:</span>
                                <strong >
                                    {'next_contact_assigned' in data && data.next_contact_assigned.toLocaleString()}
                                </strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span>Процент назначенных встреч:</span>
                                <strong >
                                    {'percentage_of_appointments_made' in data && data.percentage_of_appointments_made}%
                                </strong>
                            </div>
                        </>
                    )}

                    {type === 'directions' && (
                        <>
                            <div className={styles.infoRow}>
                                <span>Встреча:</span>
                                <strong >
                                    {'meeting' in data && data.meeting.toLocaleString()}
                                </strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span> Звонок/Мессенджер:</span>
                                <strong>
                                    {'call_or_messenger' in data && data.call_or_messenger.toLocaleString()}
                                </strong>
                            </div>
                            <div className={styles.infoRow}>
                                <span> Не определено:</span>
                                <strong>
                                    {'not_defined' in data && data.not_defined.toLocaleString()}
                                </strong>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Flex>
    );
};

export default CircledChart;