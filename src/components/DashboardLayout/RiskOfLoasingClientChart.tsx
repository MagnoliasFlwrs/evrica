import React, {useEffect, useRef, useState} from 'react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    LinearScale,
    Title,
    Tooltip,
    LineElement,
    PointElement,
    Legend
} from "chart.js";
import styles from "./DashboardLayout.module.scss";
import {Flex, Table, TableColumnsType} from "antd";
import {Chart} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
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

interface TableData {
    key: string;
    metric: string;
    [date: string]: string | number;
    total: string | number;
}

const RiskOfLoosingClientChart = ({chartDataArr, title, labels}: CallsChartProps) => {
    const chartRef = useRef<ChartJS<'bar' | 'line'>>(null);
    const [data, setData] = useState<CallsChartData | null>(null);
    const [tableData, setTableData] = useState<TableData[]>([]);
    const [formattedDates, setFormattedDates] = useState<string[]>([]);

    useEffect(() => {
        if (chartDataArr) {
            // Сортируем данные от меньшей даты к большей
            const sortedDailyStats = [...chartDataArr.daily_stats].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            // Используем отсортированные данные
            const dates = sortedDailyStats.map(stat => formatDate(stat.date));
            setFormattedDates(dates);

            const formattedTableData = sortedDailyStats.map((stat, index) => ({
                date: dates[index],
                total_calls: stat.total_calls,
                risk_calls: stat.calls,
                risk_percentage: stat.total_calls > 0 ? Math.round((stat.calls / stat.total_calls) * 100) : 0
            }));

            const totalCalls = formattedTableData.reduce((sum, item) => sum + item.total_calls, 0);
            const totalRiskCalls = formattedTableData.reduce((sum, item) => sum + item.risk_calls, 0);
            const totalPercentage = totalCalls > 0 ? Math.round((totalRiskCalls / totalCalls) * 100) : 0;

            const tableDataSource: TableData[] = [
                {
                    key: 'total_calls',
                    metric: labels[0],
                    ...Object.fromEntries(formattedTableData.map((item, idx) => [dates[idx], item.total_calls])),
                    total: totalCalls
                },
                {
                    key: 'risk_calls',
                    metric: labels[1],
                    ...Object.fromEntries(formattedTableData.map((item, idx) => [dates[idx], item.risk_calls])),
                    total: totalRiskCalls
                },
                {
                    key: 'risk_percentage',
                    metric: 'Процент риска',
                    ...Object.fromEntries(formattedTableData.map((item, idx) => [dates[idx], `${item.risk_percentage}%`])),
                    total: `${totalPercentage}%`
                }
            ];

            setTableData(tableDataSource);

            // Сохраняем оригинальные данные, но с отсортированным daily_stats
            setData({
                ...chartDataArr,
                daily_stats: sortedDailyStats
            });
        }
    }, [chartDataArr, labels]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}.${month}`;
    };

    // Подготавливаем данные для графика
    // Порядок dataset важен - первыми рисуются бары, потом линии поверх них
    const chartData: ChartData<'bar' | 'line'> = {
        labels: data?.daily_stats.map(item => formatDate(item.date)) || [], // Убрали reverse()
        datasets: [
            {
                type: 'bar' as const,
                label: labels[0],
                data: data?.daily_stats.map(item => item.total_calls) || [], // Убрали reverse()
                backgroundColor: '#007AFF',
                borderColor: '#007AFF',
                borderWidth: 1,
                borderRadius: 10,
                yAxisID: 'y',
                order: 2,
            },
            {
                type: 'bar' as const,
                label: labels[1],
                data: data?.daily_stats.map(item => item.calls) || [], // Убрали reverse()
                backgroundColor: '#ffa800',
                borderColor: '#ffa800',
                borderWidth: 1,
                borderRadius: 10,
                yAxisID: 'y',
                order: 2,
            },
            {
                type: 'line' as const,
                label: 'Процент риска',
                data: data?.daily_stats.map(item =>
                    item.total_calls > 0 ? Math.round((item.calls / item.total_calls) * 100) : 0
                ) || [], // Убрали reverse()
                backgroundColor: '#bff864',
                borderColor: '#bff864',
                borderWidth: 3,
                pointBackgroundColor: '#bff864',
                pointBorderColor: '#bff864',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBorderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1',
                order: 1,
            },
        ],
    };

    const options: ChartOptions<'bar' | 'line'> = {
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
                        if (context.datasetIndex === 2) {
                            label += context.parsed.y + '%';
                        } else {
                            label += context.parsed.y;
                        }
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
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Количество звонков',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
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
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Процент (%)',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    callback: function(value) {
                        return value + '%';
                    }
                },
                border: {
                    display: false,
                },
                suggestedMin: 0,
                suggestedMax: 100
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
    };

    const columns: TableColumnsType<TableData> = [
        {
            title: '',
            dataIndex: 'metric',
            key: 'metric',
            fixed: 'left' as const,
            width: 200,
        },
        ...formattedDates.map((date, index) => ({
            title: date,
            dataIndex: date,
            key: `date-${index}`,
            align: 'center' as const,
            width: 100,
        })),
        {
            title: 'Всего',
            dataIndex: 'total',
            key: 'total',
            align: 'center' as const,
            width: 100,
        }
    ];

    return (
        <Flex className={styles.callsChartContainer}>
            <p className={styles.callsChartContainerTitle}>{title}</p>

            <Flex className={styles.callsChartContainerTotal}>
                <p className={styles.callsChartContainerTotalTitle}>
                    Всего звонков за 7 дней: {data?.total_calls_7_days || 0}
                </p>
            </Flex>

            <Flex className={styles.callsChartBarContainer} style={{ height: '400px' }}>
                {data && (
                    <Chart
                        ref={chartRef}
                        type='bar'
                        data={chartData}
                        options={options}
                    />
                )}
            </Flex>

            <Flex className={styles.callsChartBarTable}>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    size="small"
                    bordered
                />
            </Flex>
        </Flex>
    );
};

export default RiskOfLoosingClientChart;