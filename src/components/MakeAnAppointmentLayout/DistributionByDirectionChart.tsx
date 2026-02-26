import React from 'react';
import styles from "./AnalyticsLayout2.module.scss";
import {Flex} from "antd";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface DirectionsData {
    targeted_communications: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
}

interface CircledChartProps {
    data: DirectionsData | null;
}

const DistributionByDirectionChart = ({data}: CircledChartProps) => {
    // Данные для графика (без labels)
    const chartData = {
        labels: [''],
        datasets: [
            {
                label: 'Встреча',
                data: [data?.meeting || 0],
                backgroundColor: '#bff864', // Зеленый
                borderColor: '#bff864',
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
                borderRadius: 10,
            },
            {
                label: 'Звонок/Мессенджер',
                data: [data?.call_or_messenger || 0],
                backgroundColor: '#ffb848', // Оранжевый
                borderColor: '#ffb848',
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
                borderRadius: 10,
            },
            {
                label: 'Не определено',
                data: [data?.not_defined || 0],
                backgroundColor: '#bfbfbf', // Серый
                borderColor: '#bfbfbf',
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8,
                borderRadius: 10,
            }
        ],
    };

    // Опции графика
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Скрываем легенду
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        return `${context.dataset.label}: ${value.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0',
                },
                ticks: {
                    stepSize: 10, // Шаг 10 единиц
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false // Скрываем подписи оси X
                }
            }
        },
    };

    return (
        <Flex className={styles.ProgressChart}>
            <div className={styles.chartContainer} style={{ width: '300px', height: '140px' }}>
                {data && <Bar data={chartData} options={options} />}
            </div>

            <Flex className={styles.infoBlock}>
                <div className={styles.infoRow}>
                    <span>Целевых коммуникаций:</span>
                    <strong>{data?.targeted_communications.toLocaleString()}</strong>
                </div>
                <div className={styles.infoRow}>
                    <span>Встреча:</span>
                    <strong>
                        {data?.meeting.toLocaleString()}
                    </strong>
                </div>
                <div className={styles.infoRow}>
                    <span>Звонок/Мессенджер:</span>
                    <strong>
                        {data?.call_or_messenger.toLocaleString()}
                    </strong>
                </div>
                <div className={styles.infoRow}>
                    <span>Не определено:</span>
                    <strong>
                        {data?.not_defined.toLocaleString()}
                    </strong>
                </div>
            </Flex>
        </Flex>
    );
};

export default DistributionByDirectionChart;