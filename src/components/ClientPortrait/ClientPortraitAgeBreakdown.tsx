import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions, Plugin, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { SummaryBreakdownItem } from './ClientPortraitCallsSummary';
import { CLIENT_PORTRAIT_CALLS_SUMMARY_MOCK } from './ClientPortraitCallsSummary';
import styles from './ClientPortraitAgeBreakdown.module.scss';

/** Доп. поле датасета: цвет заливки сегмента (рисуется плагином) */
type BarDatasetWithSegmentFill = {
  segmentFill?: string;
};

const SEGMENT_RADIUS = 10;

/** Chart.js на stacked bar скругляет в основном верхний кусок — рисуем все сегменты поверх через roundRect */
const roundedStackSegmentsPlugin: Plugin<'bar'> = {
  id: 'clientPortraitRoundedStackSegments',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const fill = (dataset as BarDatasetWithSegmentFill).segmentFill;
      if (!fill) return;
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;
      meta.data.forEach((element) => {
        if (!element) return;
        const bar = element as import('chart.js').BarElement;
        const { x, y, base, width } = bar.getProps(['x', 'y', 'base', 'width'], true);
        const w = width as number;
        const h = Math.abs((y as number) - (base as number));
        if (h < 0.5 || w < 0.5) return;
        const left = (x as number) - w / 2;
        const top = Math.min(y as number, base as number);
        const r = Math.min(SEGMENT_RADIUS, w / 2 - 0.25, h / 2 - 0.25);
        ctx.fillStyle = fill;
        ctx.beginPath();
        const rr = Math.max(0, r);
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(left, top, w, h, rr);
        } else {
          ctx.rect(left, top, w, h);
        }
        ctx.fill();
      });
    });
    ctx.restore();
  },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, roundedStackSegmentsPlugin);

/** Доли возрастов внутри пола (для штук в подсказке) */
const MEN_AGE_WITHIN_GENDER: SummaryBreakdownItem[] = [
  { label: 'до 25 лет', percent: 24, color: '#6366f1' },
  { label: 'от 25 до 40 лет', percent: 34, color: '#8b5cf6' },
  { label: 'от 40 до 55 лет', percent: 26, color: '#a855f7' },
  { label: 'старше 55 лет', percent: 12, color: '#c084fc' },
  { label: 'не определено', percent: 4, color: '#94a3b8' },
];

const WOMEN_AGE_WITHIN_GENDER: SummaryBreakdownItem[] = [
  { label: 'до 25 лет', percent: 18, color: '#6366f1' },
  { label: 'от 25 до 40 лет', percent: 36, color: '#8b5cf6' },
  { label: 'от 40 до 55 лет', percent: 30, color: '#a855f7' },
  { label: 'старше 55 лет', percent: 12, color: '#c084fc' },
  { label: 'не определено', percent: 4, color: '#94a3b8' },
];

const MARITAL_MEN: SummaryBreakdownItem[][] = [
  [
    { label: 'Женат / замужем', percent: 40, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 24, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 8, color: '#f97316' },
    { label: 'Не определено', percent: 28, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 55, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 26, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 7, color: '#f97316' },
    { label: 'Не определено', percent: 12, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 58, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 22, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 11, color: '#f97316' },
    { label: 'Не определено', percent: 9, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 42, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 20, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 26, color: '#f97316' },
    { label: 'Не определено', percent: 12, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 25, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 18, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 12, color: '#f97316' },
    { label: 'Не определено', percent: 45, color: '#94a3b8' },
  ],
];

const RISK_MEN: SummaryBreakdownItem[][] = [
  [
    { label: 'Да', percent: 24, color: '#ef4444' },
    { label: 'Нет', percent: 66, color: '#22c55e' },
    { label: 'Не определено', percent: 10, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 32, color: '#ef4444' },
    { label: 'Нет', percent: 57, color: '#22c55e' },
    { label: 'Не определено', percent: 11, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 36, color: '#ef4444' },
    { label: 'Нет', percent: 52, color: '#22c55e' },
    { label: 'Не определено', percent: 12, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 40, color: '#ef4444' },
    { label: 'Нет', percent: 49, color: '#22c55e' },
    { label: 'Не определено', percent: 11, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 28, color: '#ef4444' },
    { label: 'Нет', percent: 55, color: '#22c55e' },
    { label: 'Не определено', percent: 17, color: '#94a3b8' },
  ],
];

const MARITAL_WOMEN: SummaryBreakdownItem[][] = [
  [
    { label: 'Женат / замужем', percent: 44, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 26, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 6, color: '#f97316' },
    { label: 'Не определено', percent: 24, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 52, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 30, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 8, color: '#f97316' },
    { label: 'Не определено', percent: 10, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 54, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 24, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 10, color: '#f97316' },
    { label: 'Не определено', percent: 12, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 46, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 22, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 18, color: '#f97316' },
    { label: 'Не определено', percent: 14, color: '#94a3b8' },
  ],
  [
    { label: 'Женат / замужем', percent: 30, color: '#22c55e' },
    { label: 'Разведён / разведена', percent: 20, color: '#3b82f6' },
    { label: 'Вдовец / вдова', percent: 15, color: '#f97316' },
    { label: 'Не определено', percent: 35, color: '#94a3b8' },
  ],
];

const RISK_WOMEN: SummaryBreakdownItem[][] = [
  [
    { label: 'Да', percent: 20, color: '#ef4444' },
    { label: 'Нет', percent: 70, color: '#22c55e' },
    { label: 'Не определено', percent: 10, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 30, color: '#ef4444' },
    { label: 'Нет', percent: 60, color: '#22c55e' },
    { label: 'Не определено', percent: 10, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 34, color: '#ef4444' },
    { label: 'Нет', percent: 55, color: '#22c55e' },
    { label: 'Не определено', percent: 11, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 38, color: '#ef4444' },
    { label: 'Нет', percent: 52, color: '#22c55e' },
    { label: 'Не определено', percent: 10, color: '#94a3b8' },
  ],
  [
    { label: 'Да', percent: 22, color: '#ef4444' },
    { label: 'Нет', percent: 58, color: '#22c55e' },
    { label: 'Не определено', percent: 20, color: '#94a3b8' },
  ],
];

/** Короткие подписи оси X */
const AGE_AXIS_LABELS = ['до 25', '25–40', '40–55', '55+', 'не опр.'];

function quantityFromPercent(total: number, percent: number): number {
  return Math.round((total * percent) / 100);
}

function segmentCalls(cohortSize: number, segmentPercent: number): number {
  return Math.round((cohortSize * segmentPercent) / 100);
}

const RISK_STACK = 'risk';
const MARITAL_STACK = 'marital';

/** Риск: пастельно‑жёлтая гамма (глубже → светлее) */
const RISK_PALETTE = ['#d4b84a', '#ecd89e', '#faf4e4'];

/** Семья: пастельно‑синяя гамма */
const MARITAL_PALETTE = ['#6e8ec9', '#98b6e6', '#c7dcf5', '#eef5fc'];

function buildCombinedBarData(
  riskByAge: SummaryBreakdownItem[][],
  maritalByAge: SummaryBreakdownItem[][],
): ChartData<'bar'> {
  const datasets = [];

  const riskCount = riskByAge[0]?.length ?? 0;
  for (let r = 0; r < riskCount; r++) {
    const sample = riskByAge[0][r];
    const bg = RISK_PALETTE[r % RISK_PALETTE.length];
    datasets.push({
      label: `Риск: ${sample.label}`,
      data: riskByAge.map((row) => row[r]?.percent ?? 0),
      segmentFill: bg,
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
      stack: RISK_STACK,
      maxBarThickness: 56,
    });
  }

  const marCount = maritalByAge[0]?.length ?? 0;
  for (let m = 0; m < marCount; m++) {
    const sample = maritalByAge[0][m];
    const bg = MARITAL_PALETTE[m % MARITAL_PALETTE.length];
    datasets.push({
      label: `Семья: ${sample.label}`,
      data: maritalByAge.map((row) => row[m]?.percent ?? 0),
      segmentFill: bg,
      backgroundColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
      stack: MARITAL_STACK,
      maxBarThickness: 56,
    });
  }

  return {
    labels: AGE_AXIS_LABELS,
    datasets,
  };
}

function makeBarOptions(
  genderCalls: number,
  ageShares: SummaryBreakdownItem[],
  fullAgeLabels: string[],
): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: true },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 11,
          boxHeight: 11,
          padding: 10,
          font: { size: 9, family: 'Mulish, system-ui, sans-serif' },
          color: '#4b5563',
          generateLabels: (chart) =>
            chart.data.datasets.map((dataset, i) => {
              const fill = (dataset as BarDatasetWithSegmentFill).segmentFill ?? '#888';
              return {
                text: String(dataset.label ?? ''),
                fillStyle: fill,
                strokeStyle: fill,
                lineWidth: 0,
                hidden: !chart.isDatasetVisible(i),
                datasetIndex: i,
                fontColor: '#4b5563',
              };
            }),
        },
      },
      tooltip: {
        mode: 'nearest',
        intersect: true,
        displayColors: false,
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) => {
            const first = items[0];
            if (!first) return '';
            const dsLabel = String(first.dataset.label ?? '');
            const groupTitle = dsLabel.startsWith('Риск:')
              ? 'Риск потери'
              : 'Семейное положение';
            const age = fullAgeLabels[first.dataIndex] ?? '';
            return [groupTitle, age];
          },
          label: (ctx: TooltipItem<'bar'>) => {
            const pct = ctx.parsed.y ?? 0;
            const ageIdx = ctx.dataIndex;
            const agePct = ageShares[ageIdx]?.percent ?? 0;
            const callsInAge = segmentCalls(genderCalls, agePct);
            const nSeg = segmentCalls(callsInAge, pct);
            const pctStr = Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`;
            const raw = String(ctx.dataset.label ?? '');
            const short = raw.replace(/^Риск:\s*|^Семья:\s*/, '').trim();
            return `${short}: ${nSeg} шт / ${pctStr}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          maxRotation: 0,
        },
      },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
          font: { size: 10 },
        },
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
      },
    },
  };
}

type GenderBarPanelProps = {
  sectionClass: string;
  title: string;
  sharePercent: number;
  genderCalls: number;
  ageShares: SummaryBreakdownItem[];
  riskByAge: SummaryBreakdownItem[][];
  maritalByAge: SummaryBreakdownItem[][];
};

const GenderBarPanel = ({
  sectionClass,
  title,
  sharePercent,
  genderCalls,
  ageShares,
  riskByAge,
  maritalByAge,
}: GenderBarPanelProps) => {
  const data = useMemo(
    () => buildCombinedBarData(riskByAge, maritalByAge),
    [riskByAge, maritalByAge],
  );
  const fullAgeLabels = useMemo(() => ageShares.map((a) => a.label), [ageShares]);
  const options = useMemo(
    () => makeBarOptions(genderCalls, ageShares, fullAgeLabels),
    [genderCalls, ageShares, fullAgeLabels],
  );

  return (
    <div className={`${styles.genderPanel} ${sectionClass}`}>
      <h3 className={styles.genderTitle}>{title}</h3>
      <p className={styles.genderMeta}>
        {genderCalls} шт · {sharePercent}% от всех звонков
      </p>

      <div className={styles.barChartBox}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

const ClientPortraitAgeBreakdown = () => {
  const totalCalls = CLIENT_PORTRAIT_CALLS_SUMMARY_MOCK.totalCalls;
  const [menG, womenG] = CLIENT_PORTRAIT_CALLS_SUMMARY_MOCK.gender;
  const callsMen = quantityFromPercent(totalCalls, menG.percent);
  const callsWomen = quantityFromPercent(totalCalls, womenG.percent);

  return (
    <section className={styles.wrap} aria-label="Расшифровка по полу и возрасту">
      <header className={styles.head}>
        <h2 className={styles.title}>Расшифровка по полу и возрасту</h2>
        
      </header>

      <div className={styles.split}>
        <GenderBarPanel
          sectionClass={styles.genderMen}
          title="Мужчины"
          sharePercent={menG.percent}
          genderCalls={callsMen}
          ageShares={MEN_AGE_WITHIN_GENDER}
          riskByAge={RISK_MEN}
          maritalByAge={MARITAL_MEN}
        />
        <GenderBarPanel
          sectionClass={styles.genderWomen}
          title="Женщины"
          sharePercent={womenG.percent}
          genderCalls={callsWomen}
          ageShares={WOMEN_AGE_WITHIN_GENDER}
          riskByAge={RISK_WOMEN}
          maritalByAge={MARITAL_WOMEN}
        />
      </div>
    </section>
  );
};

export default ClientPortraitAgeBreakdown;
