import React, { useRef } from 'react';
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
    data?: CallsChartData;
}

const CallsChart: React.FC<CallsChartProps> = () => {
    const chartRef = useRef<ChartJS<'bar'>>(null);

    const exampleData: CallsChartData = {
        total_calls_7_days: 1395,
        daily_stats: [
            {
                date: "2025-12-17",
                total_calls: 197,
                calls: 18
            },
            {
                date: "2025-12-16",
                total_calls: 271,
                calls: 24
            },
            {
                date: "2025-12-15",
                total_calls: 199,
                calls: 27
            },
            {
                date: "2025-12-14",
                total_calls: 96,
                calls: 10
            },
            {
                date: "2025-12-13",
                total_calls: 169,
                calls: 24
            },
            {
                date: "2025-12-12",
                total_calls: 232,
                calls: 24
            },
            {
                date: "2025-12-11",
                total_calls: 231,
                calls: 29
            }
        ]
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    const chartData = {
        labels: exampleData.daily_stats.map(item => formatDate(item.date)).reverse(),
        datasets: [
            {
                label: 'Все звонки',
                data: exampleData.daily_stats.map(item => item.total_calls).reverse(),
                backgroundColor: '#007AFF',
                borderColor: '#007AFF',
                borderWidth: 1,
                borderRadius: 10,
                // barThickness: 40,

            },
            {
                label: 'Звонки',
                data: exampleData.daily_stats.map(item => item.calls).reverse(),
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
            <p className={styles.callsChartContainerTitle}>Статистика звонков за 7 дней</p>

            <Flex className={styles.callsChartContainerTotal}>
                <p className={styles.callsChartContainerTotalTitle}>Всего звонков: {exampleData.total_calls_7_days}</p>
                <Flex className={styles.callsChartLegend}>
                    <Flex className={styles.callsChartLegendItem}>
                        <span></span>
                        <p>Все звонки</p>
                    </Flex>
                    <Flex className={styles.callsChartLegendItem}>
                        <span></span>
                        <p>Звонки</p>
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

export default CallsChart;