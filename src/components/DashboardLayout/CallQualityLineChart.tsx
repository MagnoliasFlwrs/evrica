import React, {useEffect, useRef, useState} from 'react';
import styles from "./DashboardLayout.module.scss";
import {Flex} from "antd";
import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions, Filler, Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface DailyStat {
    date: string;
    high_quality: number;
    low_quality: number;
    medium_quality: number;
    total_calls: number;
}

interface CallsChartData {
    total_7_days: {
        high_quality: number;
        low_quality: number;
        medium_quality: number;
        total_calls: number;
    };
    daily_stats: DailyStat[];
}

interface CallsChartProps {
    chartDataArr?: CallsChartData | null;
    title?: string;
    labels: string[];
}

const CallQualityLineChart = ({ chartDataArr, title, labels }: CallsChartProps) => {
    const chartRef = useRef<ChartJS<'line'>>(null);
    const [data, setData] = useState<CallsChartData | null>(null);

    useEffect(() => {
        if (chartDataArr) {
            setData(chartDataArr);
        }
    }, [chartDataArr]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    const chartData = {
        labels: data?.daily_stats.map(item => formatDate(item.date)).reverse(),
        datasets: [
            {
                label: labels[0],
                data: data?.daily_stats.map(item => item.total_calls).reverse(),
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#007AFF',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: labels[1],
                data: data?.daily_stats.map(item => item.high_quality).reverse(),
                borderColor: '#bff864',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#bff864',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: labels[2],
                data: data?.daily_stats.map(item => item.medium_quality).reverse(),
                borderColor: '#ffb848',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#ffb848',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: labels[3],
                data: data?.daily_stats.map(item => item.low_quality).reverse(),
                borderColor: '#fabeb4',
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: '#fabeb4',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 13,
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y;
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: '#8E8E93',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(142, 142, 147, 0.1)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: '#8E8E93',
                    precision: 0,
                    padding: 10,
                },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        elements: {
            line: {
                tension: 0.4,
            }
        }
    };

    // Обновленные цвета для легенды
    const legendColors = ['#007AFF', '#bff864', '#ffb848', '#fabeb4'];
    return (
        <Flex className={styles.callsChartContainer}>
            <p className={styles.callsChartContainerTitle}>{title}</p>
            <Flex className={styles.callsChartContainerTotal}>
                <p className={styles.callsChartContainerTotalTitle}>
                    Всего звонков за 7 дней: {data?.total_7_days?.total_calls}
                </p>
                <Flex className={styles.callsChartLegend}>
                    {labels.map((label, index) => (
                        <Flex key={index} className={styles.callsChartLegendItem}>
                            <span style={{ background: legendColors[index] }}></span>
                            <p>{label}</p>
                        </Flex>
                    ))}
                </Flex>
            </Flex>

            <Flex className={styles.callsChartLineContainer} >
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={options}
                />
            </Flex>
        </Flex>
    );
};

export default CallQualityLineChart;