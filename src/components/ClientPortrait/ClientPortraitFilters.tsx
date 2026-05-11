import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import CategoriesFilter from '../CallsLayout/CategoriesFilter/CategoriesFilter';
import filteredCallsStyles from '../CallsLayout/FilteredCallsBlock/FilteredCallsBlock.module.scss';
import { useCallsStore } from '../../stores/callsStore';
import { useAuth } from '../../store';
import { useDashboardStore } from '../../stores/dashboardStore';
import styles from './ClientPortraitFilters.module.scss';

/** `true` — целевой клиент, `false` — сторонний (как поле `target` в API) */
export type ClientCategoryFilter = boolean;

const ClientPortraitFilters = () => {
  const [isSelected, setIsSelected] = useState(0);
  const [clientCategory, setClientCategory] = useState<ClientCategoryFilter>(true);

  const categoryCallsListObj = useCallsStore((state) => state.categoryCallsListObj);
  const user = useAuth((state) => state.user);
  const getClientPortrait = useDashboardStore((state) => state.getClientPortrait);

  const selectedCategoryId = categoryCallsListObj?.category_id;
  const dateStart = categoryCallsListObj?.date_start;
  const dateEnd = categoryCallsListObj?.date_end;

  const isFiltersIncomplete = useMemo(() => {
    return (
      !dateStart ||
      !dateEnd ||
      selectedCategoryId === null ||
      selectedCategoryId === undefined ||
      selectedCategoryId === '' ||
      !user?.organization_id
    );
  }, [dateEnd, dateStart, selectedCategoryId, user?.organization_id]);

  useEffect(() => {
    if (!isSelected || isFiltersIncomplete) {
      return;
    }

    const dateFrom = dayjs.unix(Number(dateStart)).format('YYYY-MM-DD');
    const dateTo = dayjs.unix(Number(dateEnd)).format('YYYY-MM-DD');
    const normalizedCategoryId = Number(selectedCategoryId);

    if (!Number.isFinite(normalizedCategoryId) || !user?.organization_id) {
      return;
    }


    void getClientPortrait(
      user.organization_id,
      dateFrom,
      dateTo,
      normalizedCategoryId,
      clientCategory,
    );
  }, [
    clientCategory,
    dateEnd,
    dateStart,
    getClientPortrait,
    isFiltersIncomplete,
    isSelected,
    selectedCategoryId,
    user,
  ]);

  return (
    <Flex vertical gap={20} style={{ width: '100%' }}>
      <CategoriesFilter setIsSelected={setIsSelected} />
      <Flex className={styles.wrap} gap={24} wrap="wrap" align="flex-end">
        <Flex vertical gap={6} className={styles.field}>
          <Typography.Text className={styles.label}>Категория клиента</Typography.Text>
          <Select<string>
            value={clientCategory ? 'true' : 'false'}
            options={[
              { value: 'true', label: 'Целевой' },
              { value: 'false', label: 'Сторонний' },
            ]}
            className={styles.select}
            popupMatchSelectWidth={false}
            onChange={(v) => setClientCategory(v === 'true')}
          />
        </Flex>
      </Flex>
      <Flex className={filteredCallsStyles.FilteredCallsBlock}>
        {isSelected > 0 ? (
          <Flex className={filteredCallsStyles.SelectedCalls}>

          </Flex>
        ) : (
          <p>Для просмотра портрета клиента выберите категорию звонка</p>
        )}
      </Flex>
    </Flex>
  );
};

export default ClientPortraitFilters;
