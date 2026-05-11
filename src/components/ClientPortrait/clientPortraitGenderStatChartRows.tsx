import React from 'react';
import {
  PhoneOutlined,
  WarningOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { ClientPortraitGenderStat } from '../../stores/types/clientPortraitTypes';

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
      meta?: string;
      menQuantity?: string;
      womenQuantity?: string;
      men: number;
      women: number;
      icon?: React.ReactNode;
    };

function shareOfPair(menValue: number, womenValue: number): { men: number; women: number } {
  const t = menValue + womenValue;
  if (!t) return { men: 0, women: 0 };
  return { men: (menValue / t) * 100, women: (womenValue / t) * 100 };
}

/** Строки графика «мужчины / женщины» из `clientPortrait.gender_stat` */
export function buildClientPortraitChartRowsFromGenderStat(
  gs: ClientPortraitGenderStat | null | undefined,
): ClientPortraitRow[] {
  if (!gs) return [];

  const { man: M, woman: W } = gs;
  const calls = shareOfPair(M.total_calls, W.total_calls);

  const rows: ClientPortraitRow[] = [
    { kind: 'section', key: 'calls', title: 'Звонки' },
    {
      kind: 'row',
      key: 'calls-count',
      label: 'Количество звонков',
      menQuantity: `${M.total_calls} шт`,
      womenQuantity: `${W.total_calls} шт`,
      men: calls.men,
      women: calls.women,
      icon: <PhoneOutlined />,
    },
    { kind: 'section', key: 'risk', title: 'Риск и сделка' },
    {
      kind: 'row',
      key: 'risk-loss',
      label: 'Риск потери',
      men: M.risk_of_losing_client.percentage,
      women: W.risk_of_losing_client.percentage,
      icon: <WarningOutlined />,
    },
    {
      kind: 'row',
      key: 'deal-high',
      label: 'Вероятность сделки — высокая',
      men: M.deal_probability.high.percentage,
      women: W.deal_probability.high.percentage,
      icon: <PieChartOutlined />,
    },
    {
      kind: 'row',
      key: 'deal-medium',
      label: 'Вероятность сделки — средняя',
      men: M.deal_probability.medium.percentage,
      women: W.deal_probability.medium.percentage,
      icon: <PieChartOutlined />,
    },
    {
      kind: 'row',
      key: 'deal-low',
      label: 'Вероятность сделки — низкая',
      men: M.deal_probability.low.percentage,
      women: W.deal_probability.low.percentage,
      icon: <PieChartOutlined />,
    },
    {
      kind: 'row',
      key: 'deal-undef',
      label: 'Вероятность сделки — не определено',
      men: M.deal_probability.not_defined.percentage,
      women: W.deal_probability.not_defined.percentage,
      icon: <PieChartOutlined />,
    },
    { kind: 'section', key: 'next', title: 'Договорённость на следующий шаг' },
    {
      kind: 'row',
      key: 'next-meeting',
      label: 'Встреча',
      men: M.next_contact_category.meeting.percentage,
      women: W.next_contact_category.meeting.percentage,
      icon: <ScheduleOutlined />,
    },
    {
      kind: 'row',
      key: 'next-call-messenger',
      label: 'Звонок или мессенджер',
      men: M.next_contact_category.call_or_messenger.percentage,
      women: W.next_contact_category.call_or_messenger.percentage,
      icon: <ScheduleOutlined />,
    },
    {
      kind: 'row',
      key: 'next-undef',
      label: 'Не определено',
      men: M.next_contact_category.not_defined.percentage,
      women: W.next_contact_category.not_defined.percentage,
      icon: <ScheduleOutlined />,
    },
    { kind: 'section', key: 'problem', title: 'Статус решения проблемы' },
    {
      kind: 'row',
      key: 'problem-resolved',
      label: 'Решено',
      men: M.problem_resolution_status.resolved.percentage,
      women: W.problem_resolution_status.resolved.percentage,
      icon: <CheckCircleOutlined />,
    },
    {
      kind: 'row',
      key: 'problem-partial',
      label: 'Частично решено',
      men: M.problem_resolution_status.partially_resolved.percentage,
      women: W.problem_resolution_status.partially_resolved.percentage,
      icon: <CheckCircleOutlined />,
    },
    {
      kind: 'row',
      key: 'problem-not',
      label: 'Не решено',
      men: M.problem_resolution_status.not_resolved.percentage,
      women: W.problem_resolution_status.not_resolved.percentage,
      icon: <CheckCircleOutlined />,
    },
    {
      kind: 'row',
      key: 'problem-undef',
      label: 'Не определено',
      men: M.problem_resolution_status.not_defined.percentage,
      women: W.problem_resolution_status.not_defined.percentage,
      icon: <CheckCircleOutlined />,
    },
    { kind: 'section', key: 'segment', title: 'Сегмент клиента' },
    {
      kind: 'row',
      key: 'seg-newbie',
      label: 'Новичок',
      men: M.client_segment.newbie.percentage,
      women: W.client_segment.newbie.percentage,
      icon: <TeamOutlined />,
    },
    {
      kind: 'row',
      key: 'seg-active',
      label: 'Активный',
      men: M.client_segment.active.percentage,
      women: W.client_segment.active.percentage,
      icon: <TeamOutlined />,
    },
    {
      kind: 'row',
      key: 'seg-inactive',
      label: 'Не активный',
      men: M.client_segment.inactive.percentage,
      women: W.client_segment.inactive.percentage,
      icon: <TeamOutlined />,
    },
    {
      kind: 'row',
      key: 'seg-undef',
      label: 'Не определено',
      men: M.client_segment.not_defined.percentage,
      women: W.client_segment.not_defined.percentage,
      icon: <TeamOutlined />,
    },
  ];

  return rows;
}
