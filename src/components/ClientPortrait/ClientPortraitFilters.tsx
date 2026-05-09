import React, { useState } from 'react';
import { DatePicker, Flex, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import styles from './ClientPortraitFilters.module.scss';

const { RangePicker } = DatePicker;

export type ClientCategoryFilter = 'target' | 'external';

export type ClientPortraitFilterValues = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  clientCategory: ClientCategoryFilter;
};

type ClientPortraitFiltersProps = {
  onChange?: (values: ClientPortraitFilterValues) => void;
};

const ClientPortraitFilters = ({ onChange }: ClientPortraitFiltersProps) => {
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>(() => [
    dayjs().subtract(30, 'day').startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [clientCategory, setClientCategory] = useState<ClientCategoryFilter>('target');

  const notify = (
    nextRange: [Dayjs | null, Dayjs | null],
    nextCategory: ClientCategoryFilter,
  ) => {
    onChange?.({
      dateFrom: nextRange[0],
      dateTo: nextRange[1],
      clientCategory: nextCategory,
    });
  };

  return (
    <Flex className={styles.wrap} gap={24} wrap="wrap" align="flex-end">
      <Flex vertical gap={6} className={styles.field}>
        <Typography.Text className={styles.label}>Выборка за период</Typography.Text>
        <RangePicker
          value={range}
          onChange={(dates) => {
            const next = (dates ?? [null, null]) as [Dayjs | null, Dayjs | null];
            setRange(next);
            notify(next, clientCategory);
          }}
          format="DD.MM.YYYY"
          allowClear
          className={styles.range}
        />
      </Flex>
      <Flex vertical gap={6} className={styles.field}>
        <Typography.Text className={styles.label}>Категория клиента</Typography.Text>
        <Select<ClientCategoryFilter>
          value={clientCategory}
          options={[
            { value: 'target', label: 'Целевой' },
            { value: 'external', label: 'Сторонний' },
          ]}
          className={styles.select}
          popupMatchSelectWidth={false}
          onChange={(value) => {
            setClientCategory(value);
            notify(range, value);
          }}
        />
      </Flex>
    </Flex>
  );
};

export default ClientPortraitFilters;
