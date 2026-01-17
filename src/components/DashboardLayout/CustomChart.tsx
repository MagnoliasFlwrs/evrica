import React, {useEffect, useRef, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {Flex} from "antd";
import styles from './DashboardLayout.module.scss'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip

);

interface DailyStat {
    date: string;
    total_calls: number;
    calls: number;
}

interface CallsChartData {
    total_calls_7_days: number;
    daily_stats: DailyStat[];
}

interface CallsChartProps {
    chartDataArr?: CallsChartData | null;
    title?: string;
    labels: string[];
}

const CustomChart: React.FC<CallsChartProps> = ({chartDataArr , title , labels }) => {
    const chartRef = useRef<ChartJS<'bar'>>(null);
    const [data, setData] = useState<CallsChartData | null>(null);

    useEffect(() => {
        if (chartDataArr) {
            setData(chartDataArr)
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
                backgroundColor: '#007AFF',
                borderColor: '#007AFF',
                borderWidth: 1,
                borderRadius: 10,
                // barThickness: 40,

            },
            {
                label:labels[1],
                data: data?.daily_stats.map(item => item.calls).reverse(),
                backgroundColor: '#007AFF66',
                borderColor: '#007AFF66',
                borderWidth: 1,
                borderRadius: 10,
                // barThickness: 40,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {

            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
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
                    label: function(context: any) {
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
                ticks: {
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    // drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    precision: 0,
                },
                border: {
                    display: false,
                }
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },

        bar: {
            datasets: {

            }
        }
    };

    return (
        <Flex className={styles.callsChartContainer}>
            <p className={styles.callsChartContainerTitle}>{title}</p>

            <Flex className={styles.callsChartContainerTotal}>
                <p className={styles.callsChartContainerTotalTitle}>Всего звонков: {data?.total_calls_7_days}</p>
                <Flex className={styles.callsChartLegend}>
                    <Flex className={styles.callsChartLegendItem}>
                        <span></span>
                        <p>{labels[0]}</p>
                    </Flex>
                    <Flex className={styles.callsChartLegendItem}>
                        <span></span>
                        <p>{labels[1]}</p>
                    </Flex>
                </Flex>
            </Flex>

            <Flex className={styles.callsChartBarContainer}>
                <Bar
                    ref={chartRef}
                    data={chartData}
                    options={options}
                />
            </Flex>
        </Flex>
    );
};

export default CustomChart;