import React from 'react';
import {
  PhoneOutlined,
  WarningOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import styles from './ClientPortraitChart.module.scss';

/** Доли звонков: 350 / (350 + 300) и 300 / (350 + 300), в процентах для шкалы графика */
const CALLS_MEN = (350 / (350 + 300)) * 100;
const CALLS_WOMEN = (300 / (350 + 300)) * 100;

export type ClientPortraitRow =
  | {
      kind: 'section';
      key: string;
      title: string;
    }
  | {
      kind: 'row';
      key: string;
      label: string;
      /** Дублирование в центре, если нет количественных мер на барах */
      meta?: string;
      /** Если задано — на баре: «значение / процент» */
      menQuantity?: string;
      womenQuantity?: string;
      men: number;
      women: number;
      /** Иконка в центральной колонке */
      icon?: React.ReactNode;
    };

/** Мок по таблице: мужчины слева, женщины справа; проценты 0–100 для ширины полос */
export const CLIENT_PORTRAIT_MOCK_ROWS: ClientPortraitRow[] = [
  {
    kind: 'section',
    key: 'calls',
    title: 'Звонки',
  },
  {
    kind: 'row',
    key: 'calls-count',
    label: 'Количество звонков',
    menQuantity: '350 шт',
    womenQuantity: '300 шт',
    men: CALLS_MEN,
    women: CALLS_WOMEN,
    icon: <PhoneOutlined />,
  },
  {
    kind: 'section',
    key: 'risk',
    title: 'Риск и сделка',
  },
  {
    kind: 'row',
    key: 'risk-loss',
    label: 'Риск потери',
    men: 35,
    women: 41,
    icon: <WarningOutlined />,
  },
  {
    kind: 'row',
    key: 'deal-high',
    label: 'Вероятность сделки — высокая',
    men: 40,
    women: 40,
    icon: <PieChartOutlined />,
  },
  {
    kind: 'row',
    key: 'deal-low',
    label: 'Вероятность сделки — низкая',
    men: 30,
    women: 30,
    icon: <PieChartOutlined />,
  },
  {
    kind: 'row',
    key: 'deal-undef',
    label: 'Вероятность сделки — не определено',
    men: 30,
    women: 30,
    icon: <PieChartOutlined />,
  },
  {
    kind: 'section',
    key: 'next',
    title: 'Договорённость на следующий шаг',
  },
  {
    kind: 'row',
    key: 'next-total',
    label: 'Всего договорённостей',
    menQuantity: '140 шт',
    womenQuantity: '120 шт',
    men: (140 / (140 + 120)) * 100,
    women: (120 / (140 + 120)) * 100,
    icon: <ScheduleOutlined />,
  },
  {
    kind: 'row',
    key: 'next-call',
    label: 'Звонок',
    men: 20,
    women: 20,
    icon: <ScheduleOutlined />,
  },
  {
    kind: 'row',
    key: 'next-messenger',
    label: 'Мессенджер',
    men: 50,
    women: 50,
    icon: <ScheduleOutlined />,
  },
  {
    kind: 'row',
    key: 'next-undef',
    label: 'Не определено',
    men: 30,
    women: 30,
    icon: <ScheduleOutlined />,
  },
  {
    kind: 'section',
    key: 'problem',
    title: 'Статус решения проблемы',
  },
  {
    kind: 'row',
    key: 'problem-resolved',
    label: 'Решено',
    men: 65,
    women: 65,
    icon: <CheckCircleOutlined />,
  },
  {
    kind: 'row',
    key: 'problem-not',
    label: 'Не решено',
    men: 30,
    women: 30,
    icon: <CheckCircleOutlined />,
  },
  {
    kind: 'row',
    key: 'problem-undef',
    label: 'Не определено',
    men: 5,
    women: 5,
    icon: <CheckCircleOutlined />,
  },
  {
    kind: 'section',
    key: 'segment',
    title: 'Сегмент клиента',
  },
  {
    kind: 'row',
    key: 'seg-newbie',
    label: 'Новичок',
    men: 10,
    women: 10,
    icon: <TeamOutlined />,
  },
  {
    kind: 'row',
    key: 'seg-active',
    label: 'Активный',
    men: 20,
    women: 20,
    icon: <TeamOutlined />,
  },
  {
    kind: 'row',
    key: 'seg-inactive',
    label: 'Не активный',
    men: 50,
    women: 50,
    icon: <TeamOutlined />,
  },
  {
    kind: 'row',
    key: 'seg-undef',
    label: 'Не определено',
    men: 20,
    women: 20,
    icon: <TeamOutlined />,
  },
];

function formatBarLabel(n: number): string {
  if (Number.isInteger(n)) return `${n}%`;
  return `${n.toFixed(1)}%`;
}

function formatBarLine(quantity: string | undefined, percent: number): string {
  const pct = formatBarLabel(percent);
  return quantity ? `${quantity} / ${pct}` : pct;
}

const ClientPortraitChart = () => {
  return (
    <div className={styles.chartWrap}>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.men}`} aria-hidden />
          Мужчины
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.women}`} aria-hidden />
          Женщины
        </div>
      </div>

      <div className={styles.axisLine} />

      <div className={styles.rows}>
        {CLIENT_PORTRAIT_MOCK_ROWS.map((item) => {
          if (item.kind === 'section') {
            return (
              <div key={item.key} className={styles.section}>
                {item.title}
              </div>
            );
          }

          const { men, women, label, meta, icon, menQuantity, womenQuantity } = item;
          const qtyOnBars = Boolean(menQuantity ?? womenQuantity);

          return (
            <div key={item.key} className={styles.row}>
              <div className={styles.trackLeft}>
                <div
                  className={`${styles.barLeft} ${menQuantity ? styles.barWithQuantity : ''}`}
                  style={{ width: `${Math.min(100, men)}%` }}
                >
                  <span>{formatBarLine(menQuantity, men)}</span>
                </div>
              </div>
              <div className={styles.center}>
                <div className={styles.centerInner}>
                  {icon ? <span className={styles.centerIcon}>{icon}</span> : null}
                  <div className={styles.centerTexts}>
                    <span className={styles.label}>{label}</span>
                    {meta && !qtyOnBars ? <span className={styles.meta}>{meta}</span> : null}
                  </div>
                </div>
              </div>
              <div className={styles.trackRight}>
                <div
                  className={`${styles.barRight} ${womenQuantity ? styles.barWithQuantity : ''}`}
                  style={{ width: `${Math.min(100, women)}%` }}
                >
                  <span>{formatBarLine(womenQuantity, women)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientPortraitChart;
