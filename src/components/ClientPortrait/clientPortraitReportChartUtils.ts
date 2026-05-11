import type { ChartData, ChartOptions } from 'chart.js';
import type {
  ClientPortraitGeneralStats,
  ClientPortraitGenderDetailByAge,
} from '../../stores/types/clientPortraitTypes';

/** Элемент разбивки для donut / bar отчёта «Портрет клиента» */
export type SummaryBreakdownItem = {
  label: string;
  percent: number;
  count?: number;
  color: string;
};

export function quantityFromPercent(total: number, percent: number): number {
  return Math.round((total * percent) / 100);
}

/** Доля сегмента внутри когорты (для stacked bar) */
export function segmentCalls(cohortSize: number, segmentPercent: number): number {
  return Math.round((cohortSize * segmentPercent) / 100);
}

export function buildChartRows(
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

export function mapGeneralGender(by: ClientPortraitGeneralStats['by_gender']): SummaryBreakdownItem[] {
  return [
    { label: 'Мужчины', percent: by.man.percentage, count: by.man.count, color: '#9333ea' },
    { label: 'Женщины', percent: by.woman.percentage, count: by.woman.count, color: '#ea580c' },
    {
      label: 'Не определено',
      percent: by.not_defined.percentage,
      count: by.not_defined.count,
      color: '#94a3b8',
    },
  ];
}

export function mapGeneralAge(by: ClientPortraitGeneralStats['by_age']): SummaryBreakdownItem[] {
  return [
    { label: 'до 25 лет', percent: by.under_25.percentage, count: by.under_25.count, color: '#6366f1' },
    {
      label: 'от 25 до 40 лет',
      percent: by['25_to_40'].percentage,
      count: by['25_to_40'].count,
      color: '#8b5cf6',
    },
    {
      label: 'от 40 до 55 лет',
      percent: by['40_to_55'].percentage,
      count: by['40_to_55'].count,
      color: '#a855f7',
    },
    { label: 'старше 55 лет', percent: by.over_55.percentage, count: by.over_55.count, color: '#c084fc' },
    {
      label: 'не определено',
      percent: by.not_defined.percentage,
      count: by.not_defined.count,
      color: '#94a3b8',
    },
  ];
}

export function mapGeneralSegment(by: ClientPortraitGeneralStats['by_segment']): SummaryBreakdownItem[] {
  return [
    { label: 'Новичок', percent: by.newbie.percentage, count: by.newbie.count, color: '#0ea5e9' },
    { label: 'Активный', percent: by.active.percentage, count: by.active.count, color: '#06b6d4' },
    {
      label: 'Не активный',
      percent: by.inactive.percentage,
      count: by.inactive.count,
      color: '#0891b2',
    },
    {
      label: 'Не определено',
      percent: by.not_defined.percentage,
      count: by.not_defined.count,
      color: '#94a3b8',
    },
  ];
}

export function mapGeneralStatsToCallSummary(gs: ClientPortraitGeneralStats): {
  totalCalls: number;
  gender: SummaryBreakdownItem[];
  age: SummaryBreakdownItem[];
  segment: SummaryBreakdownItem[];
} {
  return {
    totalCalls: gs.total_calls,
    gender: mapGeneralGender(gs.by_gender),
    age: mapGeneralAge(gs.by_age),
    segment: mapGeneralSegment(gs.by_segment),
  };
}

export function emptyCallSummary(): {
  totalCalls: number;
  gender: SummaryBreakdownItem[];
  age: SummaryBreakdownItem[];
  segment: SummaryBreakdownItem[];
} {
  return {
    totalCalls: 0,
    gender: [],
    age: [],
    segment: [],
  };
}

const FALLBACK_MAN: SummaryBreakdownItem = { label: 'Мужчины', percent: 0, color: '#9333ea' };
const FALLBACK_WOMAN: SummaryBreakdownItem = { label: 'Женщины', percent: 0, color: '#ea580c' };

/** Доля мужчин/женщин и total_calls из `general_stats` для панелей «Расшифровка по полу» */
export function getMenWomenFromGeneralStats(gs: ClientPortraitGeneralStats | undefined | null): {
  totalCalls: number;
  men: SummaryBreakdownItem;
  women: SummaryBreakdownItem;
} {
  if (!gs) {
    return { totalCalls: 0, men: FALLBACK_MAN, women: FALLBACK_WOMAN };
  }
  const gender = mapGeneralGender(gs.by_gender);
  return {
    totalCalls: gs.total_calls,
    men: gender[0] ?? FALLBACK_MAN,
    women: gender[1] ?? FALLBACK_WOMAN,
  };
}

export function makeDoughnutData(rows: SummaryBreakdownItem[]): ChartData<'doughnut', number[], string> {
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

export function makeDoughnutOptions(
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
            const q =
              row.count !== undefined
                ? row.count
                : quantityFromPercent(totalCalls, row.percent);
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

const GENDER_DETAIL_AGE_KEYS: (keyof ClientPortraitGenderDetailByAge)[] = [
  'under_25',
  '25_to_40',
  '40_to_55',
  'over_55',
  'not_defined',
];

const GENDER_DETAIL_AGE_SHARE_LABELS = [
  'до 25 лет',
  'от 25 до 40 лет',
  'от 40 до 55 лет',
  'старше 55 лет',
  'не определено',
] as const;

const GENDER_DETAIL_AGE_SHARE_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#94a3b8'] as const;

const MARITAL_STATUS_LABELS = ['Женат / замужем', 'Разведён / разведена', 'Вдовец / вдова', 'Не определено'] as const;
const MARITAL_STATUS_COLORS = ['#22c55e', '#3b82f6', '#f97316', '#94a3b8'] as const;

const RISK_YES_NO_LABELS = ['Да', 'Нет', 'Не определено'] as const;
const RISK_YES_NO_COLORS = ['#ef4444', '#22c55e', '#94a3b8'] as const;

/** Доли возрастов внутри пола (`gender_detail_stat`) */
export function mapGenderDetailAgeShares(side: ClientPortraitGenderDetailByAge): SummaryBreakdownItem[] {
  return GENDER_DETAIL_AGE_KEYS.map((key, i) => {
    const b = side[key];
    return {
      label: GENDER_DETAIL_AGE_SHARE_LABELS[i],
      percent: b.percentage,
      count: b.count,
      color: GENDER_DETAIL_AGE_SHARE_COLORS[i],
    };
  });
}

/** По возрастным корзинам: семейное положение (стеки «Семья») */
export function mapGenderDetailMaritalByAge(side: ClientPortraitGenderDetailByAge): SummaryBreakdownItem[][] {
  return GENDER_DETAIL_AGE_KEYS.map((key) => {
    const m = side[key].marital_status;
    return [
      {
        label: MARITAL_STATUS_LABELS[0],
        percent: m.married.percentage,
        count: m.married.count,
        color: MARITAL_STATUS_COLORS[0],
      },
      {
        label: MARITAL_STATUS_LABELS[1],
        percent: m.divorced.percentage,
        count: m.divorced.count,
        color: MARITAL_STATUS_COLORS[1],
      },
      {
        label: MARITAL_STATUS_LABELS[2],
        percent: m.widow.percentage,
        count: m.widow.count,
        color: MARITAL_STATUS_COLORS[2],
      },
      {
        label: MARITAL_STATUS_LABELS[3],
        percent: m.not_defined.percentage,
        count: m.not_defined.count,
        color: MARITAL_STATUS_COLORS[3],
      },
    ];
  });
}

/** По возрастным корзинам: риск потери (стеки «Риск») */
export function mapGenderDetailRiskByAge(side: ClientPortraitGenderDetailByAge): SummaryBreakdownItem[][] {
  return GENDER_DETAIL_AGE_KEYS.map((key) => {
    const r = side[key].risk_of_losing_client;
    return [
      { label: RISK_YES_NO_LABELS[0], percent: r.yes.percentage, count: r.yes.count, color: RISK_YES_NO_COLORS[0] },
      { label: RISK_YES_NO_LABELS[1], percent: r.no.percentage, count: r.no.count, color: RISK_YES_NO_COLORS[1] },
      {
        label: RISK_YES_NO_LABELS[2],
        percent: r.not_defined.percentage,
        count: r.not_defined.count,
        color: RISK_YES_NO_COLORS[2],
      },
    ];
  });
}

function emptyAgeShareRow(i: number): SummaryBreakdownItem {
  return {
    label: GENDER_DETAIL_AGE_SHARE_LABELS[i],
    percent: 0,
    count: 0,
    color: GENDER_DETAIL_AGE_SHARE_COLORS[i],
  };
}

function emptyMaritalRow(): SummaryBreakdownItem[] {
  return MARITAL_STATUS_LABELS.map((label, i) => ({
    label,
    percent: 0,
    count: 0,
    color: MARITAL_STATUS_COLORS[i],
  }));
}

function emptyRiskRow(): SummaryBreakdownItem[] {
  return RISK_YES_NO_LABELS.map((label, i) => ({
    label,
    percent: 0,
    count: 0,
    color: RISK_YES_NO_COLORS[i],
  }));
}

/** Заглушки 5×N, если `gender_detail_stat` ещё нет */
export function emptyGenderDetailAgeShares(): SummaryBreakdownItem[] {
  return [0, 1, 2, 3, 4].map(emptyAgeShareRow);
}

export function emptyGenderDetailMaritalByAge(): SummaryBreakdownItem[][] {
  return Array.from({ length: 5 }, () => emptyMaritalRow());
}

export function emptyGenderDetailRiskByAge(): SummaryBreakdownItem[][] {
  return Array.from({ length: 5 }, () => emptyRiskRow());
}
