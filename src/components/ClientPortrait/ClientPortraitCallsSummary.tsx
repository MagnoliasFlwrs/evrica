import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from './ClientPortraitCallsSummary.module.scss';
import { useDashboardStore } from '../../stores/dashboardStore';
import type { SummaryBreakdownItem } from './clientPortraitReportChartUtils';
import {
  buildChartRows,
  emptyCallSummary,
  makeDoughnutData,
  makeDoughnutOptions,
  mapGeneralStatsToCallSummary,
} from './clientPortraitReportChartUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

type ColumnProps = {
  title: string;
  totalCalls: number;
  items: SummaryBreakdownItem[];
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
        {rows.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <span className={styles.emptyChart}>Нет данных</span>
        )}
      </div>
    </div>
  );
};

const ClientPortraitCallsSummary = () => {
  const clientPortrait = useDashboardStore((state) => state.clientPortrait);

  const { totalCalls, gender, age, segment } = useMemo(() => {
    const gs = clientPortrait?.general_stats;
    if (!gs) return emptyCallSummary();
    return mapGeneralStatsToCallSummary(gs);
  }, [clientPortrait]);


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
