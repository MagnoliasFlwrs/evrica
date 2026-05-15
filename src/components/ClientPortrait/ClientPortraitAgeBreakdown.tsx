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
import type { SummaryBreakdownItem } from './clientPortraitReportChartUtils';
import {
  emptyGenderDetailAgeShares,
  emptyGenderDetailMaritalByAge,
  emptyGenderDetailRiskByAge,
  getMenWomenFromGeneralStats,
  mapGenderDetailAgeShares,
  mapGenderDetailMaritalByAge,
  mapGenderDetailRiskByAge,
  quantityFromPercent,
  segmentCalls,
} from './clientPortraitReportChartUtils';
import { useDashboardStore } from '../../stores/dashboardStore';
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

/** Короткие подписи оси X */
const AGE_AXIS_LABELS = ['до 25', '25–40', '40–55', '55+', 'не опр.'];

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
  riskByAge: SummaryBreakdownItem[][],
  maritalByAge: SummaryBreakdownItem[][],
): ChartOptions<'bar'> {
  const riskCount = riskByAge[0]?.length ?? 0;
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
            const dsIdx = ctx.datasetIndex;
            let item: SummaryBreakdownItem | undefined;
            if (dsIdx < riskCount) {
              item = riskByAge[ageIdx]?.[dsIdx];
            } else {
              item = maritalByAge[ageIdx]?.[dsIdx - riskCount];
            }
            const nSeg =
              item?.count !== undefined ? item.count : segmentCalls(callsInAge, pct);
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
    () => makeBarOptions(genderCalls, ageShares, fullAgeLabels, riskByAge, maritalByAge),
    [genderCalls, ageShares, fullAgeLabels, riskByAge, maritalByAge],
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
  const generalStats = useDashboardStore((state) => state.clientPortrait?.general_stats);
  const genderDetailStat = useDashboardStore((state) => state.clientPortrait?.gender_detail_stat);

  const { totalCalls, men: menG, women: womenG } = useMemo(
    () => getMenWomenFromGeneralStats(generalStats),
    [generalStats],
  );
  const callsMen = menG.count ?? quantityFromPercent(totalCalls, menG.percent);
  const callsWomen = womenG.count ?? quantityFromPercent(totalCalls, womenG.percent);

  const menDetail = useMemo(() => {
    if (!genderDetailStat?.man) {
      return {
        ageShares: emptyGenderDetailAgeShares(),
        riskByAge: emptyGenderDetailRiskByAge(),
        maritalByAge: emptyGenderDetailMaritalByAge(),
      };
    }
    const side = genderDetailStat.man;
    return {
      ageShares: mapGenderDetailAgeShares(side),
      riskByAge: mapGenderDetailRiskByAge(side),
      maritalByAge: mapGenderDetailMaritalByAge(side),
    };
  }, [genderDetailStat]);

  const womenDetail = useMemo(() => {
    if (!genderDetailStat?.woman) {
      return {
        ageShares: emptyGenderDetailAgeShares(),
        riskByAge: emptyGenderDetailRiskByAge(),
        maritalByAge: emptyGenderDetailMaritalByAge(),
      };
    }
    const side = genderDetailStat.woman;
    return {
      ageShares: mapGenderDetailAgeShares(side),
      riskByAge: mapGenderDetailRiskByAge(side),
      maritalByAge: mapGenderDetailMaritalByAge(side),
    };
  }, [genderDetailStat]);

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
          ageShares={menDetail.ageShares}
          riskByAge={menDetail.riskByAge}
          maritalByAge={menDetail.maritalByAge}
        />
        <GenderBarPanel
          sectionClass={styles.genderWomen}
          title="Женщины"
          sharePercent={womenG.percent}
          genderCalls={callsWomen}
          ageShares={womenDetail.ageShares}
          riskByAge={womenDetail.riskByAge}
          maritalByAge={womenDetail.maritalByAge}
        />
      </div>
    </section>
  );
};

export default ClientPortraitAgeBreakdown;
