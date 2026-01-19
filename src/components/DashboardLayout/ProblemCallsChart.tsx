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
    total_problem_calls: number;
    low_priority: number;
    high_priority: number;
    medium_priority: number;
}

interface CallsChartData {
    total_7_days: {
        high_priority: number;
        low_priority: number;
        medium_priority:number;
        total_problem_calls: number;
    };
    daily_stats: DailyStat[];
}

interface CallsChartProps {
    chartDataArr?: CallsChartData | null;
    title?: string;
    labels: string[];
}

const ProblemCallsChart = ({chartDataArr , title , labels} : CallsChartProps) => {
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
                label:labels[0],
                data: data?.daily_stats.map(item => item.total_problem_calls).reverse(),
                backgroundColor: '#007AFF',
                borderColor: '#007AFF',
                borderWidth: 1,
                borderRadius: 10,
                // barThickness: 40,
            },
            {
                label: labels[1],
                data: data?.daily_stats.map(item => item.high_priority).reverse(),
                backgroundColor: '#bff864',
                borderColor: '#bff864',
                borderWidth: 1,
                borderRadius: 10,
                // barThickness: 40,
            },
            {
                label:labels[2],
                data: data?.daily_stats.map(item => item.medium_priority).reverse(),
                backgroundColor: '#ffb848',
                borderColor: '#ffb848',
                borderWidth: 1,
                borderRadius: 10,
                // barThickness: 40,
            },
            {
                label:labels[3],
                data: data?.daily_stats.map(item => item.low_priority).reverse(),
                backgroundColor: '#fabeb4',
                borderColor: '#fabeb4',
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
                <p className={styles.callsChartContainerTotalTitle}>Всего звонков за 7 дней: {data?.total_7_days?.total_problem_calls}</p>
                <Flex className={styles.callsChartLegend}>
                    <Flex className={styles.callsChartLegendItem}>
                        <span style={{background:'#007AFF'}}></span>
                        <p>{labels[0]}</p>
                    </Flex>
                    <Flex className={styles.callsChartLegendItem}>
                        <span style={{background:'#bff864'}}></span>
                        <p>{labels[1]}</p>
                    </Flex>
                    <Flex className={styles.callsChartLegendItem}>
                        <span style={{background:'#ffb848'}}></span>
                        <p>{labels[2]}</p>
                    </Flex>
                    <Flex className={styles.callsChartLegendItem}>
                        <span style={{background:'#fabeb4'}}></span>
                        <p>{labels[3]}</p>
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

export default ProblemCallsChart;