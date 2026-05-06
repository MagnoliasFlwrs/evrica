import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Flex, Input, Modal, Switch, Tooltip, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer/PageContainer';
import PageTitle from '../components/ui/PageTitle/PageTitle';
import BlueButton from '../components/ui/BlueButton/BlueButton';
import BaseSelect from '../components/ui/BaseSelect/BaseSelect';
import CustomSelect from '../components/ui/CustomSelect/CustomSelect';
import styles from '../components/SettingsLayout/SettingsLayout.module.scss';

type MarkerWeight = 'positive' | 'negative';
type MarkerChannel = 'client' | 'employee';
type MarkerCallType = 'incoming' | 'outgoing';

interface MarkerItem {
  id: string;
  title: string;
  description: string;
  query: string;
  weight: MarkerWeight;
  points: number;
  reverse: boolean;
  channel: MarkerChannel;
  callType: MarkerCallType;
  color: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  threshold: number;
  markersCount: number;
  startDate: Dayjs;
  endDate: Dayjs;
  categoriesCount: number;
  markerScores: Array<{ name: string; color: string; score: number }>;
}

const markerColors = ['purple', 'green', 'mint', 'red', 'orange', 'teal', 'blue', 'sky', 'violet'];

const markersMock: MarkerItem[] = [
  {
    id: '1',
    title: 'ОБЕЩАЛИ ПЕРЕЗВОНИТЬ',
    description: 'Выявление нарушений и еще какой-то длинный текст максимум на две строки',
    query: '(=заказали|=купили|=установили NEAR/25 (не NEAR/3 актуально|нужно|интересно))',
    weight: 'negative',
    points: 10,
    reverse: true,
    channel: 'client',
    callType: 'incoming',
    color: 'green',
  },
  {
    id: '2',
    title: 'НЕ ХОЧУ',
    description: 'Работа с клиентскими возражениями',
    query: '"не хочу"|"уже нашли вариант"|"закрыли кофе"',
    weight: 'positive',
    points: 10,
    reverse: false,
    channel: 'employee',
    callType: 'outgoing',
    color: 'mint',
  },
  {
    id: '3',
    title: 'ВОЗРАЖЕНИЕ “ДОРОГО”',
    description: 'Работа с клиентскими возражениями',
    query: '"дорого"|"слишком дорого"',
    weight: 'positive',
    points: 10,
    reverse: false,
    channel: 'client',
    callType: 'incoming',
    color: 'sky',
  },
  {
    id: '4',
    title: 'НЕ ПОМОГЛИ',
    description: 'Выявление нарушений и еще какой-то длинный текст максимум на две строки',
    query: '"не помогли"|"не решили"',
    weight: 'positive',
    points: 10,
    reverse: false,
    channel: 'client',
    callType: 'incoming',
    color: 'purple',
  },
];

const checklistsMock: ChecklistItem[] = [
  {
    id: 'hr',
    title: 'HR',
    threshold: 80,
    markersCount: 12,
    categoriesCount: 4,
    startDate: dayjs('2025-10-17'),
    endDate: dayjs('2025-11-05'),
    markerScores: [
      { name: 'Приветствие', color: 'green', score: 5 },
      { name: 'Программирование беседы', color: 'green', score: 25 },
      { name: 'Использование позитивных слов', color: 'green', score: 20 },
      { name: 'Ответы на вопросы/возражения', color: 'green', score: 20 },
      { name: 'Интервью', color: 'green', score: 20 },
      { name: 'Конкуренты', color: 'green', score: 20 },
    ],
  },
  {
    id: 'sales',
    title: 'HR',
    threshold: 80,
    markersCount: 4,
    categoriesCount: 2,
    startDate: dayjs('2025-10-17'),
    endDate: dayjs('2025-11-05'),
    markerScores: [
      { name: 'Приветствие', color: 'red', score: -5 },
      { name: 'Программирование беседы', color: 'green', score: 25 },
      { name: 'Использование позитивных слов', color: 'green', score: 20 },
      { name: 'Ответы на вопросы/возражения', color: 'green', score: 20 },
      { name: 'Интервью', color: 'green', score: 20 },
      { name: 'Конкуренты', color: 'green', score: 20 },
    ],
  },
  {
    id: 'ops',
    title: 'HR',
    threshold: 80,
    markersCount: 12,
    categoriesCount: 4,
    startDate: dayjs('2025-10-17'),
    endDate: dayjs('2025-11-05'),
    markerScores: [
      { name: 'Приветствие', color: 'green', score: 5 },
      { name: 'Программирование беседы', color: 'green', score: 25 },
      { name: 'Использование позитивных слов', color: 'green', score: 20 },
      { name: 'Ответы на вопросы/возражения', color: 'green', score: 20 },
      { name: 'Интервью', color: 'green', score: 20 },
      { name: 'Конкуренты', color: 'green', score: 20 },
    ],
  },
  {
    id: 'support',
    title: 'HR',
    threshold: 80,
    markersCount: 12,
    categoriesCount: 4,
    startDate: dayjs('2025-10-17'),
    endDate: dayjs('2025-11-05'),
    markerScores: [
      { name: 'Приветствие', color: 'green', score: 5 },
      { name: 'Программирование беседы', color: 'green', score: 25 },
      { name: 'Использование позитивных слов', color: 'green', score: 20 },
      { name: 'Ответы на вопросы/возражения', color: 'green', score: 20 },
      { name: 'Интервью', color: 'green', score: 20 },
      { name: 'Конкуренты', color: 'green', score: 20 },
    ],
  },
];

const categoriesTreeData: TreeDataNode[] = [
  {
    title: 'Название категории',
    key: 'cat-1',
    children: [
      {
        title: 'Название подкатегории',
        key: 'sub-1',
        children: [
          { title: 'Иванов Иван', key: 'leaf-1' },
          { title: 'Петров Петр', key: 'leaf-2' },
        ],
      },
      { title: 'Название подкатегории', key: 'sub-2' },
      { title: 'Название подкатегории', key: 'sub-3' },
    ],
  },
  {
    title: 'Название категории',
    key: 'cat-2',
    children: [
      { title: 'Название подкатегории', key: 'sub-4' },
      { title: 'Название подкатегории', key: 'sub-5' },
    ],
  },
];

const markerTableMock = Array.from({ length: 10 }).map((_, index) => {
  const marker = markersMock[index % markersMock.length];
  return {
    rowId: `row-${index + 1}`,
    markerId: marker.id,
    title: marker.title,
    color: marker.color,
  };
});

const toWeightLabel = (value: MarkerWeight) =>
  value === 'positive' ? 'Положительный' : 'Отрицательный';
const toChannelLabel = (value: MarkerChannel) => (value === 'client' ? 'Клиент' : 'Сотрудник');
const toCallTypeLabel = (value: MarkerCallType) =>
  value === 'incoming' ? 'Входящие' : 'Исходящие';
const toReverseLabel = (value: boolean) => (value ? 'Да' : 'Нет');
const scoreSign = (value: number) => (value > 0 ? `+${value}` : String(value));

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { markerId, checklistId } = useParams<{ markerId?: string; checklistId?: string }>();

  const isMarkerEdit = Boolean(markerId) && location.pathname.includes('/settings/markers/');
  const isChecklistList = location.pathname === '/settings/checklists';
  const isChecklistEdit = /\/settings\/checklists\/[^/]+\/edit$/.test(location.pathname);
  const isChecklistMarkers = /\/settings\/checklists\/[^/]+\/edit\/markers$/.test(
    location.pathname,
  );
  const isMarkersList =
    !isMarkerEdit && !isChecklistList && !isChecklistEdit && !isChecklistMarkers;

  const marker = useMemo(
    () => markersMock.find((item) => item.id === markerId) || markersMock[0],
    [markerId],
  );

  const checklist = useMemo(
    () => checklistsMock.find((item) => item.id === checklistId) || checklistsMock[0],
    [checklistId],
  );

  const [selectedNames, setSelectedNames] = useState<string[]>(['1', '2']);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedReverse, setSelectedReverse] = useState('');
  const [selectedCallType, setSelectedCallType] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [name, setName] = useState(marker.title);
  const [description, setDescription] = useState(marker.description);
  const [query, setQuery] = useState(marker.query);
  const [weight, setWeight] = useState<MarkerWeight>(marker.weight);
  const [points, setPoints] = useState(String(marker.points));
  const [channel, setChannel] = useState<MarkerChannel>(marker.channel);
  const [callType, setCallType] = useState<MarkerCallType>(marker.callType);
  const [reverse, setReverse] = useState(marker.reverse);
  const [color, setColor] = useState(marker.color);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [checklistFilterNames, setChecklistFilterNames] = useState<string[]>(['hr']);
  const [checklistSearch, setChecklistSearch] = useState('');
  const [checklistStartDate, setChecklistStartDate] = useState<Dayjs | null>(dayjs('2025-10-17'));
  const [checklistEndDate, setChecklistEndDate] = useState<Dayjs | null>(dayjs('2025-11-05'));
  const [openedMarkerListCardId, setOpenedMarkerListCardId] = useState<string | null>(null);

  const [editChecklistName, setEditChecklistName] = useState(checklist.title);
  const [editChecklistThreshold, setEditChecklistThreshold] = useState(String(checklist.threshold));
  const [editChecklistPeriod, setEditChecklistPeriod] = useState<[Dayjs, Dayjs]>([
    checklist.startDate,
    checklist.endDate,
  ]);
  const [isDeleteChecklistModalOpen, setDeleteChecklistModalOpen] = useState(false);
  const [isCategoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [checkedCategoryKeys, setCheckedCategoryKeys] = useState<React.Key[]>([
    'sub-1',
    'leaf-1',
    'leaf-2',
  ]);

  const [selectedMarkerRows, setSelectedMarkerRows] = useState<string[]>([
    'row-1',
    'row-2',
    'row-3',
    'row-4',
  ]);
  const [markersDirty, setMarkersDirty] = useState(false);
  const [isUnsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [markerWeights, setMarkerWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    markerTableMock.forEach((item) => {
      initial[item.rowId] = 11;
    });
    return initial;
  });
  const [markerReverseMap, setMarkerReverseMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    markerTableMock.forEach((item) => {
      initial[item.rowId] = false;
    });
    return initial;
  });

  useEffect(() => {
    setName(marker.title);
    setDescription(marker.description);
    setQuery(marker.query);
    setWeight(marker.weight);
    setPoints(String(marker.points));
    setChannel(marker.channel);
    setCallType(marker.callType);
    setReverse(marker.reverse);
    setColor(marker.color);
  }, [marker]);

  useEffect(() => {
    setEditChecklistName(checklist.title);
    setEditChecklistThreshold(String(checklist.threshold));
    setEditChecklistPeriod([checklist.startDate, checklist.endDate]);
  }, [checklist]);

  const markerNameOptions = useMemo(
    () =>
      markersMock.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    [],
  );

  const checklistNameOptions = useMemo(
    () =>
      checklistsMock.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    [],
  );

  const filteredMarkers = useMemo(() => {
    return markersMock.filter((item) => {
      if (selectedNames.length && !selectedNames.includes(item.id)) return false;
      if (selectedWeight && item.weight !== selectedWeight) return false;
      if (selectedChannel && item.channel !== selectedChannel) return false;
      if (selectedReverse) {
        const reverseValue = selectedReverse === 'withReverse';
        if (item.reverse !== reverseValue) return false;
      }
      if (selectedCallType && item.callType !== selectedCallType) return false;
      if (searchValue.trim()) {
        const value = searchValue.trim().toLowerCase();
        if (!item.title.toLowerCase().includes(value)) return false;
      }
      return true;
    });
  }, [
    searchValue,
    selectedCallType,
    selectedChannel,
    selectedNames,
    selectedReverse,
    selectedWeight,
  ]);

  const filteredChecklists = useMemo(() => {
    return checklistsMock.filter((item) => {
      if (checklistFilterNames.length && !checklistFilterNames.includes(item.id)) return false;
      if (checklistSearch.trim()) {
        const value = checklistSearch.trim().toLowerCase();
        if (!item.title.toLowerCase().includes(value)) return false;
      }
      if (checklistStartDate && item.startDate.isBefore(checklistStartDate, 'day')) return false;
      if (checklistEndDate && item.endDate.isAfter(checklistEndDate, 'day')) return false;
      return true;
    });
  }, [checklistEndDate, checklistFilterNames, checklistSearch, checklistStartDate]);

  const filteredCategoryTree = useMemo(() => {
    if (!categorySearch.trim()) return categoriesTreeData;
    const value = categorySearch.trim().toLowerCase();

    const filterNode = (nodes: TreeDataNode[]): TreeDataNode[] => {
      return nodes.reduce<TreeDataNode[]>((accumulator, node) => {
        const title = String(node.title).toLowerCase();
        const children = (node.children as TreeDataNode[] | undefined) ?? [];
        const filteredChildren = filterNode(children);
        if (title.includes(value) || filteredChildren.length) {
          accumulator.push({
            ...node,
            children: filteredChildren,
          });
        }
        return accumulator;
      }, []);
    };

    return filterNode(categoriesTreeData);
  }, [categorySearch]);

  const handleTopTabNavigate = (tab: 'markers' | 'checklists') => {
    if (tab === 'markers') {
      navigate('/settings');
      return;
    }
    navigate('/settings/checklists');
  };

  const onChecklistPeriodChange = (value: [Dayjs | null, Dayjs | null] | null) => {
    if (!value || !value[0] || !value[1]) return;
    setEditChecklistPeriod([value[0], value[1]]);
  };

  const toggleMarkerRowSelection = (rowId: string) => {
    setSelectedMarkerRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      }
      return [...prev, rowId];
    });
    setMarkersDirty(true);
  };

  const changeMarkerRowWeight = (rowId: string, diff: number) => {
    setMarkerWeights((prev) => ({
      ...prev,
      [rowId]: Math.max(-20, Math.min(20, prev[rowId] + diff)),
    }));
    setMarkersDirty(true);
  };

  const toggleMarkerRowReverse = (rowId: string) => {
    setMarkerReverseMap((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
    setMarkersDirty(true);
  };

  const renderTopTabs = () => {
    const isChecklistTabActive = isChecklistList || isChecklistEdit || isChecklistMarkers;
    const isMarkerTabActive = !isChecklistTabActive;

    return (
      <div className={styles.topTabs}>
        <button type="button" className={styles.topTab}>
          Категории
        </button>
        <button
          type="button"
          className={`${styles.topTab} ${isMarkerTabActive ? styles.activeTab : ''}`}
          onClick={() => handleTopTabNavigate('markers')}
        >
          Маркеры
        </button>
        <button
          type="button"
          className={`${styles.topTab} ${isChecklistTabActive ? styles.activeTab : ''}`}
          onClick={() => handleTopTabNavigate('checklists')}
        >
          Чек-листы
        </button>
      </div>
    );
  };

  const renderMarkerEdit = () => (
    <PageContainer className={styles.page}>
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <div>
          <div className={styles.breadcrumbs}>
            <Link to="/settings">Настройки</Link>
            <span>›</span>
            <Link to="/settings">Настройка маркеров</Link>
            <span>›</span>
            <span className={styles.currentCrumb}>Редактирование</span>
          </div>
          <PageTitle text="Редактирование маркера" />
        </div>
        <BlueButton text="Сохранить изменения" icon={<SaveOutlined />} />
      </Flex>

      <div className={styles.editGrid}>
        <div className={styles.column}>
          <h3 className={styles.blockTitle}>Общие данные</h3>

          <label className={styles.fieldLabel}>Название</label>
          <div className={styles.counterField}>
            <Input
              value={name}
              maxLength={30}
              onChange={(event) => setName(event.target.value)}
              className={styles.input}
            />
            <span>{name.length}/30</span>
          </div>

          <label className={styles.fieldLabel}>Описание</label>
          <div className={styles.counterField}>
            <Input.TextArea
              value={description}
              maxLength={100}
              onChange={(event) => setDescription(event.target.value)}
              autoSize={{ minRows: 2, maxRows: 3 }}
              className={styles.input}
            />
            <span>{description.length}/100</span>
          </div>

          <h3 className={styles.blockTitle}>Детальная настройка</h3>
          <div className={styles.selectRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Вес</label>
              <BaseSelect
                value={weight}
                onChange={(value) => setWeight(value as MarkerWeight)}
                options={[
                  { value: 'positive', label: 'Положительный' },
                  { value: 'negative', label: 'Отрицательный' },
                ]}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Кол-во баллов</label>
              <Input
                value={points}
                onChange={(event) => setPoints(event.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Поиск в канале</label>
            <BaseSelect
              value={channel}
              onChange={(value) => setChannel(value as MarkerChannel)}
              options={[
                { value: 'client', label: 'Клиент' },
                { value: 'employee', label: 'Сотрудник' },
              ]}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Тип звонков</label>
            <BaseSelect
              value={callType}
              onChange={(value) => setCallType(value as MarkerCallType)}
              options={[
                { value: 'incoming', label: 'Входящие' },
                { value: 'outgoing', label: 'Исходящие' },
              ]}
            />
          </div>

          <label className={styles.switchRow}>
            <Switch checked={reverse} onChange={setReverse} />
            <span>Реверс</span>
          </label>

          <h3 className={styles.blockTitle}>Настройка цвета</h3>
          <div className={styles.colorGrid}>
            {markerColors.map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.colorTag} ${styles[item]} ${color === item ? styles.activeColor : ''}`}
                onClick={() => setColor(item)}
              >
                {name || marker.title}
              </button>
            ))}
          </div>

          <div className={styles.deleteBlock}>
            <h3 className={styles.blockTitle}>Удаление маркера</h3>
            <p>Это действие необратимо.</p>
            <p>Маркер будет удален без возможности восстановления.</p>

            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
              onClick={() => setDeleteModalOpen(true)}
            >
              Удалить маркер
            </Button>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.blockTitle}>Запрос</h3>
          <label className={styles.fieldLabel}>Текст запроса</label>
          <Input.TextArea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoSize={{ minRows: 5, maxRows: 8 }}
            className={styles.input}
          />
        </div>
      </div>

      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.deleteModal}
      >
        <Flex vertical align="center" className={styles.deleteModalContent}>
          <h3>Удаление маркера</h3>
          <p>Это действие необратимо.</p>
          <p>Маркер будет удален без возможности восстановления.</p>
          <Button danger type="primary" className={styles.deleteButton}>
            Удалить маркер
          </Button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(false)}
            className={styles.cancelDelete}
          >
            Отменить удаление
          </button>
        </Flex>
      </Modal>
    </PageContainer>
  );

  const renderMarkersList = () => (
    <PageContainer className={styles.page}>
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <PageTitle text="Настройки" />
        {renderTopTabs()}
      </Flex>

      <h2 className={styles.sectionTitle}>Настройка маркеров</h2>

      <Flex className={styles.actionsRow} align="center" justify="space-between">
        <div className={styles.filtersRow}>
          <CustomSelect
            options={markerNameOptions}
            multiple
            value={selectedNames}
            onChange={(value) => setSelectedNames(value as string[])}
            placeholder="Название маркера"
            searchable
            width="200px"
          />
          <CustomSelect
            options={[
              { value: 'positive', label: 'Положительный' },
              { value: 'negative', label: 'Отрицательный' },
            ]}
            value={selectedWeight}
            onChange={(value) => setSelectedWeight(value as string)}
            placeholder="Вес"
            width="170px"
          />
          <CustomSelect
            options={[
              { value: 'client', label: 'Клиент' },
              { value: 'employee', label: 'Сотрудник' },
            ]}
            value={selectedChannel}
            onChange={(value) => setSelectedChannel(value as string)}
            placeholder="Канал"
            width="170px"
          />
          <CustomSelect
            options={[
              { value: 'withoutReverse', label: 'Без реверса' },
              { value: 'withReverse', label: 'С реверсом' },
            ]}
            value={selectedReverse}
            onChange={(value) => setSelectedReverse(value as string)}
            placeholder="Реверс"
            width="170px"
          />
          <CustomSelect
            options={[
              { value: 'incoming', label: 'Входящий' },
              { value: 'outgoing', label: 'Исходящий' },
            ]}
            value={selectedCallType}
            onChange={(value) => setSelectedCallType(value as string)}
            placeholder="Тип звонка"
            width="170px"
          />
        </div>

        <BlueButton text="Создать новый маркер" icon={<PlusOutlined />} />
      </Flex>

      <Flex justify="end" className={styles.searchRow}>
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Поиск по названию"
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </Flex>

      <div className={styles.cardsGrid}>
        {filteredMarkers.map((item) => (
          <div key={item.id} className={styles.markerCard}>
            <div className={styles.cardTop}>
              <span className={`${styles.colorTag} ${styles[item.color]}`}>{item.title}</span>
              <Tooltip title="Редактировать маркер">
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => navigate(`/settings/markers/${item.id}/edit`)}
                >
                  <EditOutlined />
                </button>
              </Tooltip>
            </div>

            <p className={styles.cardDescription}>{item.description}</p>

            <div className={styles.cardMeta}>
              <div>
                <span>Вес</span>
                <b>
                  {toWeightLabel(item.weight)} ({item.points})
                </b>
              </div>
              <div>
                <span>Реверс</span>
                <b>{toReverseLabel(item.reverse)}</b>
              </div>
              <div>
                <span>Тип звонков</span>
                <b>{toCallTypeLabel(item.callType)}</b>
              </div>
              <div>
                <span>Канал</span>
                <b>{toChannelLabel(item.channel)}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );

  const renderChecklistsList = () => (
    <PageContainer className={styles.page}>
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <PageTitle text="Настройки" />
        {renderTopTabs()}
      </Flex>

      <h2 className={styles.sectionTitle}>Настройка чек-листов</h2>

      <Flex className={styles.actionsRow} align="center" justify="space-between">
        <div className={styles.filtersRow}>
          <CustomSelect
            options={checklistNameOptions}
            multiple
            value={checklistFilterNames}
            onChange={(value) => setChecklistFilterNames(value as string[])}
            placeholder="Название чек-листа"
            searchable
            width="210px"
          />

          <DatePicker
            value={checklistStartDate}
            onChange={setChecklistStartDate}
            format="DD/MM/YY"
            suffixIcon={<CalendarOutlined />}
            className={styles.checklistDateFilter}
            placeholder="Дата начала"
          />

          <DatePicker
            value={checklistEndDate}
            onChange={setChecklistEndDate}
            format="DD/MM/YY"
            suffixIcon={<CalendarOutlined />}
            className={styles.checklistDateFilter}
            placeholder="Дата завершения"
          />
        </div>

        <BlueButton text="Создать новый чек-лист" icon={<PlusOutlined />} />
      </Flex>

      <Flex justify="end" className={styles.searchRow}>
        <Input
          value={checklistSearch}
          onChange={(event) => setChecklistSearch(event.target.value)}
          placeholder="Поиск по названию"
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </Flex>

      <div className={styles.checklistCardsGrid}>
        {filteredChecklists.map((item) => (
          <div key={item.id} className={styles.checklistCard}>
            <div className={styles.checklistCardHeader}>
              <h4>{item.title}</h4>
              <button
                type="button"
                className={styles.editButton}
                onClick={() => navigate(`/settings/checklists/${item.id}/edit`)}
              >
                <EditOutlined />
              </button>
            </div>

            <div className={styles.checklistMetaRow}>
              <span>Порог срабатывания</span>
              <b>{item.threshold}</b>
            </div>
            <div className={styles.checklistMetaRow}>
              <span>Маркеры</span>
              <button
                type="button"
                className={styles.counterBadge}
                onClick={() =>
                  setOpenedMarkerListCardId((prev) => (prev === item.id ? null : item.id))
                }
              >
                {item.markersCount}
              </button>
            </div>

            {openedMarkerListCardId === item.id && (
              <div className={styles.markerDropdown}>
                {markersMock.map((markerItem) => (
                  <span
                    key={`${item.id}-${markerItem.id}`}
                    className={`${styles.colorTag} ${styles[markerItem.color]}`}
                  >
                    {markerItem.title}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.checklistScores}>
              {item.markerScores.map((scoreItem) => (
                <div key={`${item.id}-${scoreItem.name}`} className={styles.scoreRow}>
                  <span>{scoreItem.name}</span>
                  <b className={scoreItem.score >= 0 ? styles.scorePositive : styles.scoreNegative}>
                    {scoreSign(scoreItem.score)}
                  </b>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );

  const renderChecklistEdit = () => (
    <PageContainer className={styles.page}>
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <div>
          <div className={styles.breadcrumbs}>
            <Link to="/settings">Настройки</Link>
            <span>›</span>
            <Link to="/settings/checklists">Настройка чек-листов</Link>
            <span>›</span>
            <span className={styles.currentCrumb}>Редактирование</span>
          </div>
          <PageTitle text="Редактирование чек-листа" />
        </div>
        <BlueButton text="Сохранить изменения" icon={<SaveOutlined />} />
      </Flex>

      <div className={styles.checklistEditGrid}>
        <div className={styles.column}>
          <h3 className={styles.blockTitle}>Общие данные</h3>
          <div className={styles.checklistNameRow}>
            <div className={styles.counterField}>
              <label className={styles.fieldLabel}>Название</label>
              <Input
                value={editChecklistName}
                onChange={(event) => setEditChecklistName(event.target.value)}
                maxLength={30}
                className={styles.input}
              />
              <span>{editChecklistName.length}/30</span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Порог срабатывания</label>
              <Input
                value={editChecklistThreshold}
                onChange={(event) => setEditChecklistThreshold(event.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.editBlockCard}>
            <Flex justify="space-between" align="center" className={styles.editBlockHeader}>
              <h4>Добавленные маркеры</h4>
              <BlueButton
                text="Добавить маркеры"
                icon={<PlusOutlined />}
                onClick={() => navigate(`/settings/checklists/${checklist.id}/edit/markers`)}
              />
            </Flex>
            <div className={styles.markersInlineList}>
              {markersMock
                .concat(markersMock)
                .slice(0, 6)
                .map((item, index) => (
                  <div key={`${item.id}-${index}`} className={styles.inlineMarkerRow}>
                    <span>+11</span>
                    <span className={`${styles.colorTag} ${styles[item.color]}`}>{item.title}</span>
                  </div>
                ))}
              <span className={styles.moreCounter}>
                Еще {checklist.markersCount - 8 > 0 ? checklist.markersCount - 8 : 4}
              </span>
            </div>
          </div>

          <div className={styles.editBlockCard}>
            <Flex justify="space-between" align="center" className={styles.editBlockHeader}>
              <h4>Категории</h4>
              <BlueButton
                text="Добавить категории"
                icon={<PlusOutlined />}
                onClick={() => setCategoriesModalOpen(true)}
              />
            </Flex>
            <div className={styles.categoryListPreview}>
              <span>Название подкатегории</span>
              <span>Название подкатегории</span>
              <span>Название подкатегории</span>
              <span>Название подкатегории</span>
              <span>Название подкатегории</span>
              <span className={styles.moreCounter}>Еще {checklist.categoriesCount}</span>
            </div>
          </div>

          <div className={styles.deleteBlockCard}>
            <h4>Удаление чек-листа</h4>
            <p>Это действие необратимо.</p>
            <p>Чек-лист будет удален без возможности восстановления.</p>
            <Button
              danger
              type="primary"
              className={styles.deleteButton}
              icon={<DeleteOutlined />}
              onClick={() => setDeleteChecklistModalOpen(true)}
            >
              Удалить чек-лист
            </Button>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.blockTitle}>Период</h3>
          <DatePicker.RangePicker
            value={editChecklistPeriod}
            onChange={onChecklistPeriodChange}
            format="DD/MM/YY"
            className={styles.periodPicker}
          />
          <div className={styles.periodCard}>
            <DatePicker.RangePicker
              value={editChecklistPeriod}
              onChange={onChecklistPeriodChange}
              format="DD/MM/YY"
              className={styles.periodPickerLarge}
              open={false}
            />
            <p>Календарь периода</p>
          </div>
        </div>
      </div>

      <Modal
        open={isDeleteChecklistModalOpen}
        onCancel={() => setDeleteChecklistModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.deleteModal}
      >
        <Flex vertical align="center" className={styles.deleteModalContent}>
          <h3>Удаление чек-листа</h3>
          <p>Это действие необратимо.</p>
          <p>Чек-лист будет удален без возможности восстановления.</p>
          <Button danger type="primary" className={styles.deleteButton}>
            Удалить чек-лист
          </Button>
          <button
            type="button"
            onClick={() => setDeleteChecklistModalOpen(false)}
            className={styles.cancelDelete}
          >
            Отменить удаление
          </button>
        </Flex>
      </Modal>

      <Modal
        open={isCategoriesModalOpen}
        onCancel={() => setCategoriesModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.categoriesModal}
        closeIcon={<CloseOutlined />}
      >
        <div className={styles.categoriesModalContent}>
          <Flex justify="space-between" align="center" className={styles.categoriesModalHead}>
            <h3>Выберите категорий</h3>
            <BlueButton text="Сохранить изменения" />
          </Flex>

          <Input
            value={categorySearch}
            onChange={(event) => setCategorySearch(event.target.value)}
            placeholder="Поиск по названию"
            prefix={<SearchOutlined />}
            className={styles.categoriesSearch}
          />

          <Flex align="center" gap={10} className={styles.categoriesSelectedInfo}>
            <span className={styles.counterBadge}>{checkedCategoryKeys.length}</span>
            <span>Выбрано</span>
            <button type="button" onClick={() => setCheckedCategoryKeys([])}>
              Снять выделение
            </button>
          </Flex>

          <div className={styles.categoriesTreeWrap}>
            <Tree
              checkable
              treeData={filteredCategoryTree}
              checkedKeys={checkedCategoryKeys}
              onCheck={(keys) => setCheckedCategoryKeys(keys as React.Key[])}
              defaultExpandAll
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );

  const renderChecklistMarkers = () => (
    <PageContainer className={styles.page}>
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <div>
          <div className={styles.breadcrumbs}>
            <Link to="/settings">Настройки</Link>
            <span>›</span>
            <Link to="/settings/checklists">Настройка чек-листов</Link>
            <span>›</span>
            <Link to={`/settings/checklists/${checklist.id}/edit`}>Редактирование</Link>
            <span>›</span>
            <span className={styles.currentCrumb}>Добавление маркеров</span>
          </div>
          <PageTitle text={`Добавление маркеров в чек-лист “${checklist.title}”`} />
        </div>

        <button
          type="button"
          className={styles.linkBack}
          onClick={() => {
            if (markersDirty) {
              setUnsavedModalOpen(true);
              return;
            }
            navigate(`/settings/checklists/${checklist.id}/edit`);
          }}
        >
          Вернуться к настройке чек-листа
        </button>
      </Flex>

      <div className={styles.markerAssignTable}>
        <div className={styles.markerAssignHeader}>
          <span></span>
          <span>ФИО</span>
          <span>Вес</span>
          <span>Реверс</span>
        </div>

        {markerTableMock.map((row) => (
          <div key={row.rowId} className={styles.markerAssignRow}>
            <Checkbox
              checked={selectedMarkerRows.includes(row.rowId)}
              onChange={() => toggleMarkerRowSelection(row.rowId)}
            />

            <span className={`${styles.colorTag} ${styles[row.color]}`}>{row.title}</span>

            <div className={styles.rowWeightControl}>
              <button type="button" onClick={() => changeMarkerRowWeight(row.rowId, -1)}>
                <MinusCircleFilled />
              </button>
              <span>{scoreSign(markerWeights[row.rowId])}</span>
              <button type="button" onClick={() => changeMarkerRowWeight(row.rowId, 1)}>
                <PlusCircleFilled />
              </button>
            </div>

            <Switch
              checked={markerReverseMap[row.rowId]}
              onChange={() => toggleMarkerRowReverse(row.rowId)}
            />
          </div>
        ))}
      </div>

      {selectedMarkerRows.length > 0 && (
        <div className={styles.markerAssignFooter}>
          <Flex align="center" gap={8}>
            <span className={styles.counterBadge}>{selectedMarkerRows.length}</span>
            <span>Маркеров выбрано</span>
          </Flex>

          <Flex align="center" gap={20}>
            <button
              type="button"
              className={styles.footerCancel}
              onClick={() => {
                setSelectedMarkerRows([]);
                setMarkersDirty(false);
              }}
            >
              Отменить изменения
            </button>
            <BlueButton
              text="Сохранить изменения"
              onClick={() => {
                setMarkersDirty(false);
                navigate(`/settings/checklists/${checklist.id}/edit`);
              }}
            />
          </Flex>
        </div>
      )}

      <Modal
        open={isUnsavedModalOpen}
        onCancel={() => setUnsavedModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.unsavedModal}
      >
        <Flex vertical align="center" className={styles.deleteModalContent}>
          <h3>Изменения не сохранены</h3>
          <p>Вы собираетесь покинуть страницу добавления маркеров.</p>
          <p>Если хотите, чтобы изменения применились к чек-листу, их необходимо сохранить.</p>
          <BlueButton
            text="Сохранить изменения"
            onClick={() => {
              setUnsavedModalOpen(false);
              setMarkersDirty(false);
              navigate(`/settings/checklists/${checklist.id}/edit`);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setUnsavedModalOpen(false);
              setMarkersDirty(false);
              navigate(`/settings/checklists/${checklist.id}/edit`);
            }}
            className={styles.cancelDelete}
          >
            Отменить изменения
          </button>
        </Flex>
      </Modal>
    </PageContainer>
  );

  if (isMarkerEdit) {
    return renderMarkerEdit();
  }

  if (isChecklistList) {
    return renderChecklistsList();
  }

  if (isChecklistEdit) {
    return renderChecklistEdit();
  }

  if (isChecklistMarkers) {
    return renderChecklistMarkers();
  }

  if (isMarkersList) {
    return renderMarkersList();
  }

  return renderMarkersList();
};

export default SettingsLayout;
