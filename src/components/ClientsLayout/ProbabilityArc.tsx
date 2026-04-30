import React from 'react';
import styles from './ClientsLayout.module.scss';

type ProbabilityArcProps = {
  last: number;
  avg: number;
  total: number;
  label: string;
  totalIsOverall?: boolean;
};

const ProbabilityArc = ({
  last,
  avg,
  total,
  label,
  totalIsOverall = true,
}: ProbabilityArcProps) => {
  const safeLast = Math.max(0, last);
  const safeAvg = Math.max(0, avg);
  const safeTotal = Math.max(0, total);

  const rest = totalIsOverall ? Math.max(0, safeTotal - safeLast - safeAvg) : safeTotal;

  const sum = safeLast + safeAvg + rest;

  const segmentCount = 34;

  const getSegmentAllocations = () => {
    if (sum <= 0) {
      return { lastCount: 0, avgCount: 0, restCount: segmentCount };
    }

    const rawLast = (safeLast / sum) * segmentCount;
    const rawAvg = (safeAvg / sum) * segmentCount;
    const rawRest = (rest / sum) * segmentCount;

    let lastCount = Math.floor(rawLast);
    let avgCount = Math.floor(rawAvg);
    let restCount = Math.floor(rawRest);

    const fractions = [
      { key: 'last' as const, value: rawLast - lastCount },
      { key: 'avg' as const, value: rawAvg - avgCount },
      { key: 'rest' as const, value: rawRest - restCount },
    ].sort((first, second) => second.value - first.value);

    let allocated = lastCount + avgCount + restCount;
    let need = segmentCount - allocated;

    for (let index = 0; index < fractions.length && need > 0; index += 1) {
      const item = fractions[index];
      if (item.key === 'last') lastCount += 1;
      if (item.key === 'avg') avgCount += 1;
      if (item.key === 'rest') restCount += 1;
      need -= 1;
    }

    if (safeLast > 0 && lastCount === 0) {
      lastCount = 1;
      if (restCount > 0) restCount -= 1;
      else if (avgCount > 0) avgCount -= 1;
    }

    if (safeAvg > 0 && avgCount === 0) {
      avgCount = 1;
      if (restCount > 0) restCount -= 1;
      else if (lastCount > 1) lastCount -= 1;
    }

    allocated = lastCount + avgCount + restCount;
    if (allocated !== segmentCount) {
      restCount += segmentCount - allocated;
    }

    return { lastCount, avgCount, restCount };
  };

  const { lastCount, avgCount } = getSegmentAllocations();

  const size = 178;
  const centerX = size / 2;
  const centerY = size / 2;
  const segmentRadius = 75;
  const segmentWidth = 5.5;
  const segmentHeight = 15;

  const getSegmentPoint = (angle: number) => {
    const radians = (Math.PI / 180) * angle;
    const x = centerX + segmentRadius * Math.cos(radians);
    const y = centerY - segmentRadius * Math.sin(radians);
    return { x, y };
  };

  const resolveColor = (index: number) => {
    if (index < lastCount) return 'var(--brand-blue)';
    if (index < lastCount + avgCount) return '#80C9FF';
    return '#E9E9E9';
  };

  return (
    <div className={styles.arc}>
      <svg viewBox={`0 0 ${size} ${size / 2 + 6}`} className={styles.arcSvg} aria-hidden>
        {Array.from({ length: segmentCount }).map((_, index) => {
          const angle = 180 - (index * 180) / (segmentCount - 1);
          const { x, y } = getSegmentPoint(angle);
          return (
            <rect
              key={index}
              x={x - segmentWidth / 2}
              y={y - segmentHeight / 2}
              width={segmentWidth}
              height={segmentHeight}
              rx={segmentWidth / 2}
              fill={resolveColor(index)}
              transform={`rotate(${90 - angle} ${x} ${y})`}
            />
          );
        })}
      </svg>
      <div className={styles.inner}>{label}</div>
    </div>
  );
};

export default ProbabilityArc;
