import React, { useMemo } from 'react';
import styles from './ClientPortraitChart.module.scss';
import { useDashboardStore } from '../../stores/dashboardStore';
import { buildClientPortraitChartRowsFromGenderStat } from './clientPortraitGenderStatChartRows';

export type { ClientPortraitRow } from './clientPortraitGenderStatChartRows';

function formatBarLabel(n: number): string {
  if (Number.isInteger(n)) return `${n}%`;
  return `${n.toFixed(1)}%`;
}

function formatBarLine(quantity: string | undefined, percent: number): string {
  const pct = formatBarLabel(percent);
  return quantity ? `${quantity} / ${pct}` : pct;
}

const ClientPortraitChart = () => {
  const genderStat = useDashboardStore((state) => state.clientPortrait?.gender_stat);

  const rows = useMemo(() => buildClientPortraitChartRowsFromGenderStat(genderStat), [genderStat]);

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
        {rows.length === 0 ? (
          <p className={styles.empty}>Нет данных</p>
        ) : (
          rows.map((item) => {
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
          })
        )}
      </div>
    </div>
  );
};

export default ClientPortraitChart;
