import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from './ClientPortraitCallsSummary.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

export type SummaryBreakdownItem = {
  label: string;
  /** Доля в процентах от totalCalls */
  percent: number;
  /** Сплошной цвет для сектора Chart.js */
  color: string;
};

export type ClientPortraitCallsSummaryMock = {
  totalCalls: number;
  gender: SummaryBreakdownItem[];
  age: SummaryBreakdownItem[];
  segment: SummaryBreakdownItem[];
};

/** Мок: пол — из таблицы; возраст и сегмент — заполнители до появления API */
export const CLIENT_PORTRAIT_CALLS_SUMMARY_MOCK: ClientPortraitCallsSummaryMock = {
  totalCalls: 650,
  gender: [
    { label: 'Мужчины', percent: 45, color: '#9333ea' },
    { label: 'Женщины', percent: 40, color: '#ea580c' },
    { label: 'Не определено', percent: 5, color: '#94a3b8' },
  ],
  age: [
    { label: 'до 25 лет', percent: 18, color: '#6366f1' },
    { label: 'от 25 до 40 лет', percent: 32, color: '#8b5cf6' },
    { label: 'от 40 до 55 лет', percent: 28, color: '#a855f7' },
    { label: 'старше 55 лет', percent: 14, color: '#c084fc' },
    { label: 'не определено', percent: 8, color: '#94a3b8' },
  ],
  segment: [
    { label: 'Новичок', percent: 10, color: '#0ea5e9' },
    { label: 'Активный', percent: 25, color: '#06b6d4' },
    { label: 'Не активный', percent: 50, color: '#0891b2' },
    { label: 'Не определено', percent: 15, color: '#94a3b8' },
  ],
};

function quantityFromPercent(total: number, percent: number): number {
  return Math.round((total * percent) / 100);
}

/** Если сумма долей меньше 100%, добавляем сектор «Прочее», чтобы круг замыкался */
function buildChartRows(
  items: SummaryBreakdownItem[],
  addRemainder: boolean,
): SummaryBreakdownItem[] {
  if (!addRemainder) return items;
  const sum = items.reduce((s, i) => s + i.percent, 0);
  const gap = Math.round((100 - sum) * 10) / 10;
  if (gap <= 0.05) return items;
  return [
    ...items,
    {
      label: 'Прочее',
      percent: gap,
      color: '#e2e8f0',
    },
  ];
}

function makeDoughnutData(rows: SummaryBreakdownItem[]): ChartData<'doughnut', number[], string> {
  return {
    labels: rows.map((r) => r.label),
    datasets: [
      {
        data: rows.map((r) => r.percent),
        backgroundColor: rows.map((r) => r.color),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };
}

function makeDoughnutOptions(
  totalCalls: number,
  rows: SummaryBreakdownItem[],
): ChartOptions<'doughnut'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '58%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 10,
          font: { size: 11, family: 'Mulish, system-ui, sans-serif' },
          color: '#4b5563',
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const row = rows[ctx.dataIndex];
            if (!row) return '';
            const q = quantityFromPercent(totalCalls, row.percent);
            const pct = Number.isInteger(row.percent)
              ? `${row.percent}%`
              : `${row.percent.toFixed(1)}%`;
            return ` ${row.label}: ${q} шт / ${pct}`;
          },
        },
      },
    },
  };
}

type ColumnProps = {
  title: string;
  totalCalls: number;
  items: SummaryBreakdownItem[];
  /** По умолчанию при неполной сумме долей добавляется «Прочее»; для «Всего» — false */
  addRemainder?: boolean;
};

const SummaryDonutColumn = ({ title, totalCalls, items, addRemainder = true }: ColumnProps) => {
  const rows = useMemo(() => buildChartRows(items, addRemainder), [items, addRemainder]);
  const data = useMemo(() => makeDoughnutData(rows), [rows]);
  const options = useMemo(() => makeDoughnutOptions(totalCalls, rows), [totalCalls, rows]);

  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{title}</h3>
      <div className={styles.chartBox}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

const ClientPortraitCallsSummary = () => {
  const { totalCalls, gender, age, segment } = CLIENT_PORTRAIT_CALLS_SUMMARY_MOCK;

  return (
    <section className={styles.summaryWrap} aria-label="Сводка по количеству звонков">
      <header className={styles.head}>
        <h2 className={styles.title}>Количество звонков</h2>
        <span className={styles.totalBadge}>{totalCalls} шт</span>
      </header>
      <div className={styles.columns}>
        <SummaryDonutColumn title="Всего" totalCalls={totalCalls} items={gender} addRemainder={false} />
        <SummaryDonutColumn title="Возраст" totalCalls={totalCalls} items={age} />
        <SummaryDonutColumn title="Сегмент клиента" totalCalls={totalCalls} items={segment} />
      </div>
    </section>
  );
};

export default ClientPortraitCallsSummary;
