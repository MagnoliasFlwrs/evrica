import {
  DeleteOutlined,
  MinusCircleFilled,
  PlusCircleFilled,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Flex, Input, Modal, Spin, Switch, Tooltip } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from '../components/SettingsLayout/SettingsLayout.module.scss';
import BaseSelect from '../components/ui/BaseSelect/BaseSelect';
import BlueButton from '../components/ui/BlueButton/BlueButton';
import CustomSelect from '../components/ui/CustomSelect/CustomSelect';
import PageContainer from '../components/ui/PageContainer/PageContainer';
import PageTitle from '../components/ui/PageTitle/PageTitle';
import StaticRangePicker from '../components/ui/StaticRangePicker/StaticRangePicker';
import {
  SettingsMarkerGroupApi,
  useSettingsStore,
  type SettingsChecklistApi,
  type SettingsDictionaryApi,
  type SettingsMarkerType,
} from '../stores/settingsStore';

type MarkerWeight = 'positive' | 'negative';
type MarkerChannel = 'client' | 'employee';
type MarkerCallType = 'incoming' | 'outgoing';
type MarkerType = SettingsMarkerType;

interface MarkerItem {
  id: string;
  apiId: string | number | null;
  markerType: MarkerType;
  title: string;
  description: string;
  query: string;
  weight: MarkerWeight;
  points: number;
  reverse: boolean;
  channel: MarkerChannel;
  callType: MarkerCallType;
  color: string;
  colorToken: string | null;
  raw?: SettingsDictionaryApi | null;
}

interface ChecklistMarkerItem {
  id: string;
  title: string;
  markerType: MarkerType;
  score: number;
  colorToken: string | null;
}

interface ChecklistMarkerAssignRow {
  rowId: string;
  apiId: string | number | null;
  title: string;
  markerType: MarkerType;
  colorToken: string | null;
  defaultWeight: number;
  defaultReverse: boolean;
  rawEntry?: Record<string, unknown> | null;
  rawDictionary?: SettingsDictionaryApi | null;
}

interface ChecklistItem {
  id: string;
  apiId: string | number | null;
  title: string;
  threshold: number;
  markersCount: number;
  startDate: Dayjs;
  endDate: Dayjs;
  categoriesCount: number;
  markerScores: ChecklistMarkerItem[];
  raw?: SettingsChecklistApi | null;
}

const markerPalettes = [
  { id: 'purple', text: '#8d1697', background: '#f9e7fe' },
  { id: 'green', text: '#486a12', background: '#edfbcc' },
  { id: 'mint', text: '#126d69', background: '#ccfbf0' },
  { id: 'red', text: '#c93030', background: '#fee5e5' },
  { id: 'orange', text: '#a66000', background: '#ffefdc' },
  { id: 'teal', text: '#007a8a', background: '#d8f8fd' },
  { id: 'blue', text: '#00598f', background: '#ecf8fe' },
  { id: 'sky', text: '#1f6fe5', background: '#deedff' },
  { id: 'violet', text: '#8212bf', background: '#efdfff' },
] as const;

const markerColors = markerPalettes.map((item) => item.id);

const defaultMarkerPalette = markerPalettes[6];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = Number(value.replace(',', '.'));
    if (Number.isFinite(normalized)) return normalized;
  }
  return fallback;
};

const toText = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const toBoolean = (value: unknown) =>
  value === true || value === 1 || value === '1' || value === 'true';

const toMarkerType = (value: unknown): MarkerType => {
  if (value === 'system' || value === 'client' || value === 'for_group') {
    return value;
  }
  return 'client';
};

const resolveMarkerPalette = (token?: string | null) => {
  const normalized = token?.trim().toLowerCase();

  if (!normalized) {
    return defaultMarkerPalette;
  }

  const palette = markerPalettes.find(
    (item) =>
      item.id === normalized ||
      item.text.toLowerCase() === normalized ||
      item.background.toLowerCase() === normalized,
  );

  return palette || defaultMarkerPalette;
};

const getMarkerTagStyle = (token?: string | null) => {
  const palette = resolveMarkerPalette(token);

  return {
    color: palette.text,
    background: palette.background,
    borderColor: 'transparent',
  };
};

const getMarkerWeightConfig = (item: SettingsDictionaryApi) => {
  const positive = Math.abs(toNumber(item.positive_weight));
  const negative = Math.abs(toNumber(item.negative_weight));

  if (negative > 0 && positive === 0) {
    return {
      weight: 'negative' as MarkerWeight,
      points: negative,
    };
  }

  return {
    weight: 'positive' as MarkerWeight,
    points: positive > 0 ? positive : negative,
  };
};

const toDayjsValue = (value: unknown, fallback = dayjs()) => {
  if (dayjs.isDayjs(value)) return value;

  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = String(Math.trunc(value)).length > 10 ? dayjs(value) : dayjs.unix(value);
    return parsed.isValid() ? parsed : fallback;
  }

  if (typeof value === 'string' && value.trim()) {
    if (/^\d+$/.test(value.trim())) {
      const numericValue = Number(value);
      const parsed = value.trim().length > 10 ? dayjs(numericValue) : dayjs.unix(numericValue);
      return parsed.isValid() ? parsed : fallback;
    }

    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : fallback;
  }

  return fallback;
};

const formatApiDate = (value: Dayjs | null) => (value ? value.format('YYYY-MM-DD') : null);

const buildMarkerKey = (id: string | number, type: MarkerType) => `${type}:${id}`;

const resolvePayloadId = (payload: unknown) => {
  if (!isRecord(payload)) return null;

  if (payload.id !== undefined && payload.id !== null) {
    return payload.id as string | number;
  }

  if (isRecord(payload.data) && payload.data.id !== undefined && payload.data.id !== null) {
    return payload.data.id as string | number;
  }

  if (
    isRecord(payload.dictionary) &&
    payload.dictionary.id !== undefined &&
    payload.dictionary.id !== null
  ) {
    return payload.dictionary.id as string | number;
  }

  return null;
};

const getChecklistDictionaryEntity = (value: unknown) => {
  if (!isRecord(value)) return null;
  if (isRecord(value.dictionary)) return value.dictionary as SettingsDictionaryApi;
  return value as SettingsDictionaryApi;
};

const getChecklistDictionaryId = (value: unknown) => {
  if (!isRecord(value)) return null;

  if (value.dictionary_id !== undefined && value.dictionary_id !== null) {
    return value.dictionary_id as string | number;
  }

  if (value.id !== undefined && value.id !== null && !isRecord(value.dictionary)) {
    return value.id as string | number;
  }

  const dictionary = getChecklistDictionaryEntity(value);
  if (dictionary?.id !== undefined && dictionary.id !== null) {
    return dictionary.id;
  }

  return null;
};

const getSignedWeight = (value: unknown, fallback = 0) => {
  if (!isRecord(value)) return fallback;

  const dictionary = getChecklistDictionaryEntity(value);
  const positive = Math.abs(toNumber(value.positive_weight ?? dictionary?.positive_weight));
  const negative = Math.abs(toNumber(value.negative_weight ?? dictionary?.negative_weight));

  if (negative > 0 && positive === 0) {
    return -negative;
  }

  if (positive > 0) {
    return positive;
  }

  return fallback;
};

const flattenChecklistDictionaries = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter(isRecord).map((item) => ({
      markerType: toMarkerType(item.dictionary_type),
      payload: item,
    }));
  }

  if (!isRecord(value)) {
    return [];
  }

  return ['client', 'system'].flatMap((type) => {
    const group = value[type];
    if (!Array.isArray(group)) return [];
    return group.filter(isRecord).map((item) => ({
      markerType: toMarkerType(item.dictionary_type ?? type),
      payload: item,
    }));
  });
};

const mapApiMarkerToView = (item: SettingsDictionaryApi): MarkerItem => {
  const { weight, points } = getMarkerWeightConfig(item);
  const markerType = toMarkerType(item.type ?? item.dictionary_type ?? item.marker_type);
  const colorToken =
    toText(item.color_success) ||
    toText(item.color_reject) ||
    toText(item.color) ||
    resolveMarkerPalette(null).id;

  return {
    id: String(item.id ?? 'new'),
    apiId: (item.id as string | number | undefined) ?? null,
    markerType,
    title: toText(item.name, `Маркер ${String(item.id ?? '')}`),
    description: toText(item.description),
    query: toText(item.query),
    weight,
    points,
    reverse: toBoolean(item.reverse),
    channel: toBoolean(item.search_in_channel_2) ? 'employee' : 'client',
    callType: toBoolean(item.search_out_call) ? 'outgoing' : 'incoming',
    color: resolveMarkerPalette(colorToken).id,
    colorToken,
    raw: item,
  };
};

const mapApiChecklistToView = (item: SettingsChecklistApi): ChecklistItem => {
  const markerScores = flattenChecklistDictionaries(item.dictionaries).map(
    ({ markerType, payload }) => {
      const dictionary = getChecklistDictionaryEntity(payload);
      const positive = Math.abs(
        toNumber(
          (payload as Record<string, unknown>).positive_weight ?? dictionary?.positive_weight,
        ),
      );
      const negative = Math.abs(
        toNumber(
          (payload as Record<string, unknown>).negative_weight ?? dictionary?.negative_weight,
        ),
      );
      const score =
        negative > 0 && positive === 0 ? -negative : positive > 0 ? positive : -negative;

      return {
        id: String(dictionary?.id ?? (payload as Record<string, unknown>).id ?? Math.random()),
        title: toText(dictionary?.name, 'Маркер'),
        markerType,
        score,
        colorToken: toText(dictionary?.color_success) || toText(dictionary?.color_reject),
      };
    },
  );

  const categoriesCount = Array.isArray(item.categories)
    ? item.categories.length
    : isRecord(item.categories)
      ? Object.keys(item.categories).length
      : toNumber(item.categories_count ?? item.locations_count ?? item.category_count, 0);

  return {
    id: String(item.id ?? 'new'),
    apiId: (item.id as string | number | undefined) ?? null,
    title: toText(item.name ?? item.title, `Чек-лист ${String(item.id ?? '')}`),
    threshold: toNumber(
      item.threshold ?? item.acceptance_percentage ?? item.checklist_acceptance_percentage,
      0,
    ),
    markersCount: markerScores.length,
    startDate: toDayjsValue(item.date_start ?? item.start_date),
    endDate: toDayjsValue(item.date_end ?? item.end_date),
    categoriesCount,
    markerScores,
    raw: item,
  };
};

const emptyMarker: MarkerItem = {
  id: 'new',
  apiId: null,
  markerType: 'client',
  title: '',
  description: '',
  query: '',
  weight: 'positive',
  points: 0,
  reverse: false,
  channel: 'client',
  callType: 'incoming',
  color: 'blue',
  colorToken: defaultMarkerPalette.id,
};

const emptyChecklist: ChecklistItem = {
  id: 'new',
  apiId: null,
  title: '',
  threshold: 0,
  markersCount: 0,
  categoriesCount: 0,
  startDate: dayjs(),
  endDate: dayjs(),
  markerScores: [],
};

// const categoriesTreeData: TreeDataNode[] = [
//   {
//     title: 'Название категории',
//     key: 'cat-1',
//     children: [
//       {
//         title: 'Название подкатегории',
//         key: 'sub-1',
//         children: [
//           { title: 'Иванов Иван', key: 'leaf-1' },
//           { title: 'Петров Петр', key: 'leaf-2' },
//         ],
//       },
//       { title: 'Название подкатегории', key: 'sub-2' },
//       { title: 'Название подкатегории', key: 'sub-3' },
//     ],
//   },
//   {
//     title: 'Название категории',
//     key: 'cat-2',
//     children: [
//       { title: 'Название подкатегории', key: 'sub-4' },
//       { title: 'Название подкатегории', key: 'sub-5' },
//     ],
//   },
// ];

const markerTableMock = [
  { rowId: 'row-1', markerId: '1', title: 'ОБЕЩАЛИ ПЕРЕЗВОНИТЬ', color: 'green' },
  { rowId: 'row-2', markerId: '2', title: 'НЕ ХОЧУ', color: 'mint' },
  { rowId: 'row-3', markerId: '3', title: 'ВОЗРАЖЕНИЕ “ДОРОГО”', color: 'sky' },
  { rowId: 'row-4', markerId: '4', title: 'НЕ ПОМОГЛИ', color: 'purple' },
  { rowId: 'row-5', markerId: '5', title: 'ПРОГРАММИРОВАНИЕ БЕСЕДЫ', color: 'orange' },
  { rowId: 'row-6', markerId: '6', title: 'ИНТЕРВЬЮ', color: 'blue' },
  { rowId: 'row-7', markerId: '7', title: 'КОНКУРЕНТЫ', color: 'violet' },
  { rowId: 'row-8', markerId: '8', title: 'ПРИВЕТСТВИЕ', color: 'teal' },
  { rowId: 'row-9', markerId: '9', title: 'ОТВЕТЫ НА ВОЗРАЖЕНИЯ', color: 'red' },
  { rowId: 'row-10', markerId: '10', title: 'ПОЗИТИВНЫЕ СЛОВА', color: 'green' },
];

const toMarkerLabel = (value: MarkerType) => (value === 'client' ? 'Клиентские' : 'Системные');
const toWeightLabel = (value: MarkerWeight) =>
  value === 'positive' ? 'Положительный' : 'Отрицательный';
const toChannelLabel = (value: MarkerChannel) => (value === 'client' ? 'Клиент' : 'Сотрудник');
const toCallTypeLabel = (value: MarkerCallType) =>
  value === 'incoming' ? 'Входящие' : 'Исходящие';
const toReverseLabel = (value: boolean) => (value ? 'Да' : 'Нет');
const scoreSign = (value: number) => (value > 0 ? `+${value}` : String(value));
const iconSrc = {
  marker: '/icons/marker.svg',
  checklist: '/icons/checklist.svg',
  weight: '/icons/weight.svg',
  reverse: '/icons/reverse.svg',
  call: '/icons/call.svg',
  dateFrom: '/icons/date-from.svg',
  dateTo: '/icons/date-to.svg',
} as const;

const SettingsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { markerId, checklistId, groupId } = useParams<{
    markerId?: string;
    checklistId?: string;
    groupId?: string;
  }>();
  const markerTypeFromQuery = useMemo(() => {
    const type = new URLSearchParams(location.search).get('type');
    return type === 'client' || type === 'system' || type === 'for_group' ? type : null;
  }, [location.search]);
  const isNewMarker = markerId === 'new';
  const isNewChecklist = checklistId === 'new';

  const markersApi = useSettingsStore((state) => state.markers);
  const markerDetailsByKey = useSettingsStore((state) => state.markerDetailsByKey);
  const markersLoading = useSettingsStore((state) => state.markersLoading);
  const markerSaving = useSettingsStore((state) => state.markerSaving);
  const markerDeleting = useSettingsStore((state) => state.markerDeleting);
  const markersError = useSettingsStore((state) => state.markersError);
  const checklistsApi = useSettingsStore((state) => state.checklists);
  const checklistsLoading = useSettingsStore((state) => state.checklistsLoading);
  const checklistSaving = useSettingsStore((state) => state.checklistSaving);
  const checklistDeleting = useSettingsStore((state) => state.checklistDeleting);
  const checklistsError = useSettingsStore((state) => state.checklistsError);
  const markerGroups = useSettingsStore((state) => state.markerGroups);
  const markerGroupsLoading = useSettingsStore((state) => state.markerGroupsLoading);
  const fetchMarkerGroups = useSettingsStore((state) => state.fetchMarkerGroups);
  const saveMarkerGroup = useSettingsStore((state) => state.saveMarkerGroup);
  const deleteMarkerGroup = useSettingsStore((state) => state.deleteMarkerGroup);
  const fetchMarkers = useSettingsStore((state) => state.fetchMarkers);
  const fetchMarkerById = useSettingsStore((state) => state.fetchMarkerById);
  const saveMarker = useSettingsStore((state) => state.saveMarker);
  const deleteMarker = useSettingsStore((state) => state.deleteMarker);
  const fetchChecklists = useSettingsStore((state) => state.fetchChecklists);
  const saveChecklist = useSettingsStore((state) => state.saveChecklist);
  const deleteChecklist = useSettingsStore((state) => state.deleteChecklist);

  const isMarkerEdit = Boolean(markerId) && location.pathname.includes('/settings/markers/');
  const isChecklistList = location.pathname === '/settings/checklists';
  const isChecklistEdit = /\/settings\/checklists\/[^/]+\/edit$/.test(location.pathname);
  const isChecklistMarkers = /\/settings\/checklists\/[^/]+\/edit\/markers$/.test(
    location.pathname,
  );
  const isMarkersList =
    !isMarkerEdit && !isChecklistList && !isChecklistEdit && !isChecklistMarkers;

  const markerItems = useMemo(() => markersApi.map(mapApiMarkerToView), [markersApi]);
  const checklistItems = useMemo(() => checklistsApi.map(mapApiChecklistToView), [checklistsApi]);

  const markerFromList = useMemo(() => {
    if (isNewMarker) {
      return emptyMarker;
    }

    const typedMatch = markerTypeFromQuery
      ? markerItems.find((item) => item.id === markerId && item.markerType === markerTypeFromQuery)
      : null;

    if (typedMatch) {
      return typedMatch;
    }

    return markerItems.find((item) => item.id === markerId) || markerItems[0] || emptyMarker;
  }, [isNewMarker, markerId, markerItems, markerTypeFromQuery]);

  const marker = useMemo(() => {
    if (isNewMarker) {
      return emptyMarker;
    }

    const markerKey = buildMarkerKey(
      markerFromList.apiId ?? markerId ?? markerFromList.id,
      markerFromList.markerType,
    );
    const raw = markerDetailsByKey[markerKey] ?? markerFromList.raw;

    if (raw) {
      return mapApiMarkerToView(raw);
    }

    return markerFromList;
  }, [isNewMarker, markerDetailsByKey, markerFromList, markerId]);

  const checklist = useMemo(() => {
    if (isNewChecklist) {
      return emptyChecklist;
    }
    return (
      checklistItems.find((item) => item.id === checklistId) || checklistItems[0] || emptyChecklist
    );
  }, [checklistId, checklistItems, isNewChecklist]);

  const checklistMarkerRows = useMemo<ChecklistMarkerAssignRow[]>(() => {
    const rows: ChecklistMarkerAssignRow[] = [];
    const existingItems = flattenChecklistDictionaries(checklist.raw?.dictionaries);
    const existingMap = new Map<
      string,
      { markerType: MarkerType; payload: Record<string, unknown> }
    >();

    existingItems.forEach(({ markerType, payload }) => {
      const normalizedPayload = payload as Record<string, unknown>;
      const dictionaryId = getChecklistDictionaryId(normalizedPayload);
      if (dictionaryId == null) return;
      existingMap.set(buildMarkerKey(dictionaryId, markerType), {
        markerType,
        payload: normalizedPayload,
      });
    });

    const usedKeys = new Set<string>();

    markerItems.forEach((item) => {
      const apiId = item.apiId ?? item.id;
      const rowId = buildMarkerKey(apiId, item.markerType);
      const existing = existingMap.get(rowId);
      const rawDictionary =
        (existing?.payload ? getChecklistDictionaryEntity(existing.payload) : item.raw) ?? item.raw;

      rows.push({
        rowId,
        apiId,
        title: item.title,
        markerType: item.markerType,
        colorToken:
          toText(rawDictionary?.color_success) ||
          toText(rawDictionary?.color_reject) ||
          item.colorToken,
        defaultWeight: existing
          ? getSignedWeight(
              existing.payload,
              item.weight === 'negative' ? -item.points : item.points,
            )
          : item.weight === 'negative'
            ? -item.points
            : item.points,
        defaultReverse: existing
          ? toBoolean(existing.payload.reverse ?? rawDictionary?.reverse)
          : item.reverse,
        rawEntry: existing?.payload ?? null,
        rawDictionary: rawDictionary ?? null,
      });
      usedKeys.add(rowId);
    });

    existingItems.forEach(({ markerType, payload }) => {
      const normalizedPayload = payload as Record<string, unknown>;
      const dictionaryId = getChecklistDictionaryId(normalizedPayload);
      if (dictionaryId == null) return;

      const rowId = buildMarkerKey(dictionaryId, markerType);
      if (usedKeys.has(rowId)) return;

      const dictionary = getChecklistDictionaryEntity(normalizedPayload);

      rows.push({
        rowId,
        apiId: dictionaryId,
        title: toText(dictionary?.name, `Маркер ${String(dictionaryId)}`),
        markerType,
        colorToken: toText(dictionary?.color_success) || toText(dictionary?.color_reject),
        defaultWeight: getSignedWeight(normalizedPayload),
        defaultReverse: toBoolean(normalizedPayload.reverse ?? dictionary?.reverse),
        rawEntry: normalizedPayload,
        rawDictionary: dictionary ?? null,
      });
    });

    return rows.sort((left, right) => left.title.localeCompare(right.title, 'ru'));
  }, [checklist.raw, markerItems]);

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedMarkerTypes, setSelectedMarkerTypes] = useState<string[]>([]);
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
  const [markerType, setMarkerType] = useState<MarkerType>(marker.markerType);
  const [channel, setChannel] = useState<MarkerChannel>(marker.channel);
  const [callType, setCallType] = useState<MarkerCallType>(marker.callType);
  const [reverse, setReverse] = useState(marker.reverse);
  const [color, setColor] = useState(marker.color);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );
  const [showAllChecklistMarkers, setShowAllChecklistMarkers] = useState(false);

  const [checklistFilterNames, setChecklistFilterNames] = useState<string[]>([]);
  const [checklistSearch, setChecklistSearch] = useState('');
  const [checklistStartDate, setChecklistStartDate] = useState<Dayjs | null>(null);
  const [checklistEndDate, setChecklistEndDate] = useState<Dayjs | null>(null);
  const [checklistCardScrollState, setChecklistCardScrollState] = useState<
    Record<string, { top: boolean; bottom: boolean }>
  >({});
  const checklistScoreRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  const [selectedMarkerRows, setSelectedMarkerRows] = useState<string[]>([]);
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

  // Стейты для редактирования/создания группы
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState<{
    id?: number;
    name: string;
    color: string;
    type: 'client' | 'system';
    dictionaries_ids: number[];
  }>({
    name: '',
    color: '#007aff',
    type: 'client',
    dictionaries_ids: [],
  });

  // Стейты для удаления группы
  const [isDeleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ id: number; type: string } | null>(null);

  // Стейты для добавления маркеров в группу
  const [isGroupMarkersModalOpen, setGroupMarkersModalOpen] = useState(false);
  const [selectedGroupMarkers, setSelectedGroupMarkers] = useState<number[]>([]);

  useEffect(() => {
    void fetchMarkers();
    void fetchChecklists();
  }, [fetchChecklists, fetchMarkers]);

  useEffect(() => {
    void fetchMarkers();
    void fetchChecklists();
    void fetchMarkerGroups();
  }, [fetchChecklists, fetchMarkers, fetchMarkerGroups]);

  useEffect(() => {
    if (!isNewMarker && markerFromList.apiId != null) {
      void fetchMarkerById(markerFromList.apiId, markerTypeFromQuery ?? markerFromList.markerType);
    }
  }, [
    fetchMarkerById,
    isNewMarker,
    markerFromList.apiId,
    markerFromList.markerType,
    markerTypeFromQuery,
  ]);

  useEffect(() => {
    setFeedback(null);
  }, [location.pathname]);

  useEffect(() => {
    setName(marker.title);
    setDescription(marker.description);
    setQuery(marker.query);
    setWeight(marker.weight);
    setPoints(String(marker.points));
    setMarkerType(marker.markerType);
    setChannel(marker.channel);
    setCallType(marker.callType);
    setReverse(marker.reverse);
    setColor(marker.color);
  }, [marker]);

  useEffect(() => {
    setEditChecklistName(checklist.title);
    setEditChecklistThreshold(String(checklist.threshold));
    setEditChecklistPeriod([checklist.startDate, checklist.endDate]);
    setShowAllChecklistMarkers(false);
  }, [checklist]);

  useEffect(() => {
    const selectedRows = checklistMarkerRows
      .filter((item) => item.rawEntry)
      .map((item) => item.rowId);

    const nextWeights: Record<string, number> = {};
    const nextReverseMap: Record<string, boolean> = {};

    checklistMarkerRows.forEach((item) => {
      nextWeights[item.rowId] = item.defaultWeight;
      nextReverseMap[item.rowId] = item.defaultReverse;
    });

    setSelectedMarkerRows(selectedRows);
    setMarkerWeights(nextWeights);
    setMarkerReverseMap(nextReverseMap);
    setMarkersDirty(false);
  }, [checklistMarkerRows]);

  const markerNameOptions = useMemo(
    () =>
      markerItems.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    [markerItems],
  );

  const checklistNameOptions = useMemo(
    () =>
      checklistItems.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    [checklistItems],
  );

  const activeGroup = useMemo(() => {
    if (!groupId) return null;
    return markerGroups.find((g) => String(g.id) === groupId) || null;
  }, [groupId, markerGroups]);

  const filteredMarkers = useMemo(() => {
    let baseItems = markerItems;
    if (activeGroup) {
      const allowedMarkerIds = activeGroup.dictionaries.map((d) => String(d.dictionary_id));
      baseItems = baseItems.filter((item) => allowedMarkerIds.includes(String(item.apiId)));
    }

    return baseItems.filter((item) => {
      if (selectedNames.length && !selectedNames.includes(item.id)) return false;
      if (selectedMarkerTypes.length && !selectedMarkerTypes.includes(item.markerType))
        return false;
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
    markerItems,
    activeGroup,
    searchValue,
    selectedCallType,
    selectedChannel,
    selectedNames,
    selectedMarkerTypes,
    selectedReverse,
    selectedWeight,
  ]);

  const filteredChecklists = useMemo(() => {
    return checklistItems.filter((item) => {
      if (checklistFilterNames.length && !checklistFilterNames.includes(item.id)) return false;
      if (checklistSearch.trim()) {
        const value = checklistSearch.trim().toLowerCase();
        if (!item.title.toLowerCase().includes(value)) return false;
      }
      if (checklistStartDate && item.startDate.isBefore(checklistStartDate, 'day')) return false;
      if (checklistEndDate && item.endDate.isAfter(checklistEndDate, 'day')) return false;
      return true;
    });
  }, [checklistEndDate, checklistFilterNames, checklistItems, checklistSearch, checklistStartDate]);

  useEffect(() => {
    const nextState: Record<string, { top: boolean; bottom: boolean }> = {};

    filteredChecklists.forEach((item) => {
      const container = checklistScoreRefs.current[item.id];
      if (!container) return;

      nextState[item.id] = {
        top: container.scrollTop > 2,
        bottom: container.scrollTop + container.clientHeight < container.scrollHeight - 2,
      };
    });

    setChecklistCardScrollState(nextState);
  }, [filteredChecklists]);

  // const filteredCategoryTree = useMemo(() => {
  //   if (!categorySearch.trim()) return categoriesTreeData;
  //   const value = categorySearch.trim().toLowerCase();

  //   const filterNode = (nodes: TreeDataNode[]): TreeDataNode[] => {
  //     return nodes.reduce<TreeDataNode[]>((accumulator, node) => {
  //       const title = String(node.title).toLowerCase();
  //       const children = (node.children as TreeDataNode[] | undefined) ?? [];
  //       const filteredChildren = filterNode(children);
  //       if (title.includes(value) || filteredChildren.length) {
  //         accumulator.push({
  //           ...node,
  //           children: filteredChildren,
  //         });
  //       }
  //       return accumulator;
  //     }, []);
  //   };

  //   return filterNode(categoriesTreeData);
  // }, [categorySearch]);

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

  const handleSaveMarker = async () => {
    // Проверяем обязательные поля
    if (!name.trim()) {
      setShowValidationErrors(true);
      return;
    }

    // Сбрасываем ошибки, если всё ок
    setShowValidationErrors(false);

    const normalizedPoints = Math.max(0, Math.abs(toNumber(points)));
    const basePayload = isRecord(marker.raw) ? marker.raw : {};
    const payload: Record<string, unknown> = {
      ...basePayload,
      name: name.trim(),
      description: description.trim() || null,
      query: query.trim(),
      color: color,
      color_success: color,
      color_reject: color,
      reverse: reverse ? 1 : 0,
      positive_weight: weight === 'positive' ? normalizedPoints : 0,
      negative_weight: weight === 'negative' ? normalizedPoints : 0,
      search_in_channel_1: channel === 'client' ? 1 : 0,
      search_in_channel_2: channel === 'employee' ? 1 : 0,
      search_in_call: callType === 'incoming' ? 1 : 0,
      search_out_call: callType === 'outgoing' ? 1 : 0,
      type: markerType,
      dictionary_type: markerType,
      marker_type: markerType,
      is_valid: 1,
    };

    if (!isNewMarker && marker.apiId != null) {
      payload.id = marker.apiId;
    }

    const response = await saveMarker(payload);

    if (!response) {
      setFeedback({
        type: 'error',
        text: markersError || 'Не удалось сохранить маркер',
      });
      return;
    }

    const savedId = resolvePayloadId(response) ?? marker.apiId;

    setFeedback({ type: 'success', text: 'Маркер сохранен' });

    if (savedId != null) {
      navigate(`/settings/markers/${savedId}/edit`);
      return;
    }

    navigate('/settings');
  };

  const handleDeleteMarker = async () => {
    if (marker.apiId == null) {
      setDeleteModalOpen(false);
      navigate('/settings');
      return;
    }

    const isDeleted = await deleteMarker(marker.apiId, marker.markerType);

    if (!isDeleted) {
      setFeedback({
        type: 'error',
        text: markersError || 'Не удалось удалить маркер',
      });
      return;
    }

    setDeleteModalOpen(false);
    navigate('/settings');
  };

  const handleAddMarkersClick = async () => {
    // Если чек-лист УЖЕ сохранен ранее — просто переходим на страницу маркеров
    if (!isNewChecklist && checklist.apiId != null) {
      navigate(`/settings/checklists/${checklist.id}/edit/markers`);
      return;
    }

    // Если это новый чек-лист, проверяем, ввел ли пользователь название
    if (!editChecklistName.trim()) {
      setShowValidationErrors(true);
      setFeedback({
        type: 'error',
        text: 'Сначала введите название, чтобы сохранить чек-лист и выбрать маркеры',
      });
      return;
    }
    setShowValidationErrors(false);

    // Автоматически сохраняем чек-лист
    const normalizedThreshold = Math.max(0, Math.round(toNumber(editChecklistThreshold)));
    const basePayload = isRecord(checklist.raw) ? checklist.raw : {};
    const payload: Record<string, unknown> = {
      ...basePayload,
      name: editChecklistName.trim(),
      title: editChecklistName.trim(),
      threshold: normalizedThreshold,
      acceptance_percentage: normalizedThreshold,
      checklist_acceptance_percentage: normalizedThreshold,
      date_start: formatApiDate(editChecklistPeriod[0]),
      date_end: formatApiDate(editChecklistPeriod[1]),
      start_date: formatApiDate(editChecklistPeriod[0]),
      end_date: formatApiDate(editChecklistPeriod[1]),
      dictionaries: (isRecord(basePayload) ? (basePayload.dictionaries as unknown) : undefined) ?? {
        client: [],
        system: [],
        for_group: [],
      },
    };

    const response = await saveChecklist(payload);

    if (!response) {
      setFeedback({ type: 'error', text: checklistsError || 'Не удалось создать чек-лист' });
      return;
    }

    const savedId = resolvePayloadId(response);
    setFeedback({ type: 'success', text: 'Чек-лист создан. Выберите маркеры.' });

    // Обновляем список чек-листов, чтобы он появился в стейте
    void fetchChecklists();

    // Перекидываем на страницу маркеров уже с НОВЫМ ID
    if (savedId != null) {
      navigate(`/settings/checklists/${savedId}/edit/markers`);
    } else {
      navigate('/settings/checklists');
    }
  };

  const handleOpenCreateGroup = () => {
    setGroupForm({ name: '', color: '#007aff', type: 'client', dictionaries_ids: [] });
    setGroupModalOpen(true);
  };

  const handleOpenEditGroup = (group: SettingsMarkerGroupApi) => {
    setGroupForm({
      id: group.id,
      name: group.name,
      color: group.color,
      type: group.type,
      dictionaries_ids: group.dictionaries.map((d) => d.dictionary_id),
    });
    setGroupModalOpen(true);
  };

  const handleSaveGroup = async () => {
    if (!groupForm.name.trim()) return;
    const success = await saveMarkerGroup(groupForm);
    if (success) {
      setGroupModalOpen(false);
      setFeedback({ type: 'success', text: 'Группа успешно сохранена' });
    } else {
      setFeedback({ type: 'error', text: 'Не удалось сохранить группу' });
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    const success = await deleteMarkerGroup(groupToDelete.id, groupToDelete.type);
    if (success) {
      setDeleteGroupModalOpen(false);
      setFeedback({ type: 'success', text: 'Группа удалена' });
      // Если мы находились внутри этой группы, выкидываем обратно в общий список
      if (activeGroup?.id === groupToDelete.id) {
        navigate('/settings');
      }
    } else {
      setFeedback({ type: 'error', text: 'Не удалось удалить группу' });
    }
  };

  const handleOpenGroupMarkers = () => {
    if (!activeGroup) return;
    setSelectedGroupMarkers(activeGroup.dictionaries.map((d) => d.dictionary_id));
    setGroupMarkersModalOpen(true);
  };

  const handleSaveGroupMarkers = async () => {
    if (!activeGroup) return;
    const success = await saveMarkerGroup({
      id: activeGroup.id,
      name: activeGroup.name,
      color: activeGroup.color,
      type: activeGroup.type,
      dictionaries_ids: selectedGroupMarkers,
    });
    if (success) {
      setGroupMarkersModalOpen(false);
      setFeedback({ type: 'success', text: 'Маркеры группы обновлены' });
    } else {
      setFeedback({ type: 'error', text: 'Не удалось обновить маркеры' });
    }
  };

  const handleSaveChecklist = async () => {
    if (!editChecklistName.trim()) {
      setShowValidationErrors(true);

      return;
    }
    setShowValidationErrors(false);

    const normalizedThreshold = Math.max(0, Math.round(toNumber(editChecklistThreshold)));
    const basePayload = isRecord(checklist.raw) ? checklist.raw : {};
    const payload: Record<string, unknown> = {
      ...basePayload,
      name: editChecklistName.trim(),
      title: editChecklistName.trim(),
      threshold: normalizedThreshold,
      acceptance_percentage: normalizedThreshold,
      checklist_acceptance_percentage: normalizedThreshold,
      date_start: formatApiDate(editChecklistPeriod[0]),
      date_end: formatApiDate(editChecklistPeriod[1]),
      start_date: formatApiDate(editChecklistPeriod[0]),
      end_date: formatApiDate(editChecklistPeriod[1]),
      dictionaries: (isRecord(basePayload) ? (basePayload.dictionaries as unknown) : undefined) ?? {
        client: [],
        system: [],
        for_group: [],
      },
    };

    if (!isNewChecklist && checklist.apiId != null) {
      payload.id = checklist.apiId;
    }

    const response = await saveChecklist(payload);

    if (!response) {
      setFeedback({
        type: 'error',
        text: checklistsError || 'Не удалось сохранить чек-лист',
      });
      return;
    }

    const savedId = resolvePayloadId(response) ?? checklist.apiId;

    setFeedback({ type: 'success', text: 'Чек-лист сохранен' });

    if (savedId != null) {
      navigate(`/settings/checklists/${savedId}/edit`);
      return;
    }

    navigate('/settings/checklists');
  };

  const handleDeleteChecklist = async () => {
    if (checklist.apiId == null) {
      setDeleteChecklistModalOpen(false);
      navigate('/settings/checklists');
      return;
    }

    const isDeleted = await deleteChecklist(checklist.apiId);

    if (!isDeleted) {
      setFeedback({
        type: 'error',
        text: checklistsError || 'Не удалось удалить чек-лист',
      });
      return;
    }

    setDeleteChecklistModalOpen(false);
    navigate('/settings/checklists');
  };

  const handleSaveChecklistMarkers = async () => {
    if (checklist.apiId == null) {
      navigate('/settings/checklists');
      return;
    }

    const normalizedThreshold = Math.max(0, Math.round(toNumber(checklist.threshold)));
    const basePayload = isRecord(checklist.raw) ? checklist.raw : {};
    const dictionaries = checklistMarkerRows.reduce<Record<MarkerType, Record<string, unknown>[]>>(
      (accumulator, row) => {
        if (!selectedMarkerRows.includes(row.rowId) || row.apiId == null) {
          return accumulator;
        }

        const rawEntry = isRecord(row.rawEntry) ? row.rawEntry : {};
        const rawDictionary = isRecord(row.rawDictionary) ? row.rawDictionary : null;
        const signedWeight = markerWeights[row.rowId] ?? row.defaultWeight;
        const paletteToken =
          row.colorToken ||
          toText(rawEntry.color_success) ||
          toText(rawEntry.color_reject) ||
          toText(rawDictionary?.color_success) ||
          toText(rawDictionary?.color_reject) ||
          defaultMarkerPalette.id;

        accumulator[row.markerType].push({
          ...rawEntry,
          dictionary_id: row.apiId,
          dictionary_type: row.markerType,
          positive_weight: signedWeight > 0 ? Math.abs(signedWeight) : 0,
          negative_weight: signedWeight < 0 ? Math.abs(signedWeight) : 0,
          reverse: markerReverseMap[row.rowId] ? 1 : 0,
          color_success: toText(rawEntry.color_success) || paletteToken,
          color_reject: toText(rawEntry.color_reject) || paletteToken,
          search_in_call:
            rawEntry.search_in_call ?? (toBoolean(rawDictionary?.search_in_call) ? 1 : 0),
          search_out_call:
            rawEntry.search_out_call ?? (toBoolean(rawDictionary?.search_out_call) ? 1 : 0),
          dictionary: rawDictionary ? { ...rawDictionary } : undefined,
        });

        return accumulator;
      },
      {
        client: [],
        system: [],
        for_group: [],
      },
    );

    const payload: Record<string, unknown> = {
      ...basePayload,
      id: checklist.apiId,
      name: checklist.title,
      title: checklist.title,
      threshold: normalizedThreshold,
      acceptance_percentage: normalizedThreshold,
      checklist_acceptance_percentage: normalizedThreshold,
      date_start: formatApiDate(checklist.startDate),
      date_end: formatApiDate(checklist.endDate),
      start_date: formatApiDate(checklist.startDate),
      end_date: formatApiDate(checklist.endDate),
      dictionaries,
    };

    const response = await saveChecklist(payload);

    if (!response) {
      setFeedback({
        type: 'error',
        text: checklistsError || 'Не удалось сохранить маркеры чек-листа',
      });
      return;
    }

    setMarkersDirty(false);
    setFeedback({ type: 'success', text: 'Маркеры чек-листа сохранены' });
    navigate(`/settings/checklists/${checklist.id}/edit`);
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
      [rowId]: (prev[rowId] ?? 0) + diff,
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

  const renderFeedback = () => {
    if (!feedback) return null;

    return (
      <div
        className={`${styles.feedbackBanner} ${
          feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError
        }`}
      >
        {feedback.text}
      </div>
    );
  };

  const renderFilterIcon = (src: string, alt: string) => (
    <span className={styles.filterIconWrap} aria-hidden="true">
      <img src={src} alt={alt} className={styles.filterIcon} />
    </span>
  );

  const renderFilterShell = (src: string, alt: string, control: React.ReactNode) => (
    <div className={styles.filterShell}>
      {src && renderFilterIcon(src, alt)}
      <div className={styles.filterShellControl}>{control}</div>
    </div>
  );

  const handleChecklistScoresScroll = (checklistItemId: string, target: HTMLDivElement) => {
    const nextState = {
      top: target.scrollTop > 2,
      bottom: target.scrollTop + target.clientHeight < target.scrollHeight - 2,
    };

    setChecklistCardScrollState((prev) => {
      const current = prev[checklistItemId];

      if (current?.top === nextState.top && current?.bottom === nextState.bottom) {
        return prev;
      }

      return {
        ...prev,
        [checklistItemId]: nextState,
      };
    });
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
      <div>
        <div>
          <div className={styles.breadcrumbs}>
            <Link to="/settings">Настройки</Link>
            <span>›</span>
            <Link to="/settings">Настройка маркеров</Link>
            <span>›</span>
            <span className={styles.currentCrumb}>
              {isNewMarker ? 'Создание' : 'Редактирование'}
            </span>
          </div>
        </div>
        <Flex className={styles.headerRow} align="center" justify="space-between">
          <PageTitle text={isNewMarker ? 'Создание маркера' : 'Редактирование маркера'} />
          <BlueButton
            text={markerSaving ? 'Сохраняем...' : 'Сохранить изменения'}
            icon={<img alt="сохранить" src="/icons/save.svg" />}
            onClick={handleSaveMarker}
            disabled={markerSaving || markerDeleting}
          />
        </Flex>
      </div>

      {renderFeedback()}

      {!isNewMarker && markersLoading && !marker.raw ? (
        <div className={styles.loaderWrap}>
          <Spin />
        </div>
      ) : (
        <div className={styles.editGrid}>
          <div className={styles.column}>
            <h3 className={styles.markerBlockTitle}>Общие данные</h3>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Тип маркера</label>
              <BaseSelect
                variant="light"
                value={markerType}
                onChange={(value) => setMarkerType(value as MarkerType)}
                options={[
                  { value: 'client', label: 'Клиентский' },
                  { value: 'system', label: 'Системный' },
                ]}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Название*</label>
              <div className={styles.counterField}>
                <Input
                  value={name}
                  maxLength={30}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (showValidationErrors) setShowValidationErrors(false);
                  }}
                  className={`${styles.input} ${showValidationErrors && !name.trim() ? styles.inputError : ''}`}
                  status={showValidationErrors && !name.trim() ? 'error' : undefined}
                />
                <span>{name.length}/30</span>
              </div>
              {showValidationErrors && !name.trim() && (
                <span className={styles.errorText}>Введите название маркера</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
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
            </div>

            <h3 className={styles.markerBlockTitle}>Детальная настройка</h3>
            <div className={styles.selectRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Вес</label>
                <BaseSelect
                  variant="light"
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
                variant="light"
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
                variant="light"
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

            <h3 className={styles.markerBlockTitle}>Настройка цвета</h3>
            <div className={styles.colorGrid}>
              {markerColors.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.colorTag} ${styles[item]} ${color === item ? styles.activeColor : ''}`}
                  onClick={() => setColor(item)}
                >
                  {name || marker.title || 'Маркер'}
                </button>
              ))}
            </div>

            <div className={styles.deleteBlock}>
              <h3 className={styles.markerBlockTitle}>Удаление маркера</h3>
              <p>Это действие необратимо.</p>
              <p>Маркер будет удален без возможности восстановления.</p>

              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                className={styles.deleteButton}
                onClick={() => setDeleteModalOpen(true)}
                disabled={isNewMarker || markerDeleting || marker.apiId == null}
              >
                Удалить маркер
              </Button>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.markerBlockTitle}>Запрос</h3>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Текст запроса</label>
              <Input.TextArea
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (showValidationErrors) setShowValidationErrors(false);
                }}
                autoSize={{ minRows: 5, maxRows: 8 }}
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

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
          <Button
            danger
            type="primary"
            className={styles.deleteButton}
            onClick={handleDeleteMarker}
            loading={markerDeleting}
          >
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
        <div>
          {/* Если мы внутри группы, показываем хлебные крошки */}
          {activeGroup ? (
            <div className={styles.breadcrumbs}>
              <Link to="/settings">Настройки</Link>
              <span>›</span>
              <Link to="/settings">Маркеры</Link>
              <span>›</span>
              <span className={styles.currentCrumb}>{activeGroup.name}</span>
            </div>
          ) : (
            <PageTitle text="Настройки" />
          )}
        </div>
        {renderTopTabs()}
      </Flex>

      <Flex className={styles.sectionHeaderRow} align="center" justify="space-between">
        <h2 className={styles.sectionTitleCompact}>
          {activeGroup ? `Группа: ${activeGroup.name}` : 'Настройка маркеров'}
        </h2>
        <Flex gap={12}>
          {activeGroup ? (
            <BlueButton
              text="Добавить маркеры"
              icon={<PlusOutlined />}
              onClick={handleOpenGroupMarkers}
            />
          ) : (
            <>
              <button className={styles.secondaryButton} onClick={handleOpenCreateGroup}>
                <PlusOutlined /> Создать группу
              </button>
              <BlueButton
                text="Создать новый маркер"
                icon={<PlusOutlined />}
                onClick={() => navigate('/settings/markers/new/edit')}
              />
            </>
          )}
        </Flex>
      </Flex>

      {/* БЛОК С ГРУППАМИ  */}
      {!activeGroup && (
        <div className={styles.groupsWrapper}>
          <h3 className={styles.listTitle}>Группы маркеров</h3>
          {markerGroupsLoading ? (
            <Spin size="small" />
          ) : markerGroups.length > 0 ? (
            <div className={styles.groupsGrid}>
              {markerGroups.map((group) => (
                <div
                  key={group.id}
                  className={styles.groupCard}
                  onClick={() => navigate(`/settings/markers/group/${group.id}`)}
                >
                  <div className={styles.groupCardHeader}>
                    <Flex align="center" gap={8}>
                      <div
                        className={styles.groupColorDot}
                        style={{ backgroundColor: group.color }}
                      ></div>
                      <span className={styles.groupTypeBadge}>
                        {group.type === 'client' ? 'Клиентская' : 'Системная'}
                      </span>
                    </Flex>
                    <Flex gap={4}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditGroup(group);
                        }}
                      >
                        <img alt="редактировать" src="/icons/edit.svg" />
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToDelete({ id: group.id, type: group.type });
                          setDeleteGroupModalOpen(true);
                        }}
                      >
                        <img alt="редактировать" src="/icons/delete.svg" />
                      </button>
                    </Flex>
                  </div>
                  <h4 className={styles.groupCardTitle}>{group.name}</h4>
                  <p className={styles.groupCardCount}>
                    Маркеров: {group.dictionaries?.length || 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <span className={styles.emptyHint}>Группы не найдены</span>
          )}
        </div>
      )}

      {/* ФИЛЬТРЫ И СПИСОК МАРКЕРОВ */}
      <Flex className={styles.actionsRow} align="center" justify="space-between">
        <div className={styles.filtersRow}>
          {renderFilterShell(
            '',
            '',
            <CustomSelect
              options={[
                { value: 'client', label: 'Клиентские' },
                { value: 'system', label: 'Системные' },
              ]}
              multiple
              value={selectedMarkerTypes}
              onChange={(value) => setSelectedMarkerTypes(value as string[])}
              placeholder="Тип маркера"
              width="200px"
              isEmbedded
            />,
          )}
          {renderFilterShell(
            iconSrc.marker,
            '',
            <CustomSelect
              options={markerNameOptions}
              multiple
              value={selectedNames}
              onChange={(value) => setSelectedNames(value as string[])}
              placeholder="Название маркера"
              searchable
              width="200px"
              isEmbedded
            />,
          )}
          {renderFilterShell(
            iconSrc.weight,
            '',
            <CustomSelect
              options={[
                { value: 'positive', label: 'Положительный' },
                { value: 'negative', label: 'Отрицательный' },
              ]}
              value={selectedWeight}
              onChange={(value) => setSelectedWeight(value as string)}
              placeholder="Вес"
              width="170px"
              isEmbedded
            />,
          )}
          {renderFilterShell(
            iconSrc.marker,
            '',
            <CustomSelect
              options={[
                { value: 'client', label: 'Клиент' },
                { value: 'employee', label: 'Сотрудник' },
              ]}
              value={selectedChannel}
              onChange={(value) => setSelectedChannel(value as string)}
              placeholder="Канал"
              width="170px"
              isEmbedded
            />,
          )}
          {renderFilterShell(
            iconSrc.reverse,
            '',
            <CustomSelect
              options={[
                { value: 'withoutReverse', label: 'Без реверса' },
                { value: 'withReverse', label: 'С реверсом' },
              ]}
              value={selectedReverse}
              onChange={(value) => setSelectedReverse(value as string)}
              placeholder="Реверс"
              width="170px"
              isEmbedded
            />,
          )}
          {renderFilterShell(
            iconSrc.call,
            '',
            <CustomSelect
              options={[
                { value: 'incoming', label: 'Входящий' },
                { value: 'outgoing', label: 'Исходящий' },
              ]}
              value={selectedCallType}
              onChange={(value) => setSelectedCallType(value as string)}
              placeholder="Тип звонка"
              width="170px"
              isEmbedded
            />,
          )}
        </div>
      </Flex>

      {renderFeedback()}

      <Flex align="center" justify="space-between" className={styles.listHeaderRow}>
        <h3 className={styles.listTitle}>Список маркеров</h3>
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Поиск по названию"
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </Flex>

      {markersLoading ? (
        <div className={styles.loaderWrap}>
          <Spin />
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredMarkers.length > 0 ? (
            filteredMarkers.map((item) => (
              <div key={`${item.markerType}-${item.id}`} className={styles.markerCard}>
                <div className={styles.cardTop}>
                  <span className={styles.colorTag} style={getMarkerTagStyle(item.colorToken)}>
                    {item.title}
                  </span>
                  <Tooltip title="Редактировать маркер">
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() =>
                        navigate(`/settings/markers/${item.id}/edit?type=${item.markerType}`)
                      }
                    >
                      <img alt="редактировать" src="/icons/edit.svg" />
                    </button>
                  </Tooltip>
                </div>
                <p className={styles.cardDescription}>{item.description || 'Без описания'}</p>
                <div className={styles.cardMeta}>
                  <div>
                    <span>Тип</span>
                    <b>{toMarkerLabel(item.markerType)}</b>
                  </div>
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
            ))
          ) : (
            <span className={styles.emptyHint}>Маркеры не найдены</span>
          )}
        </div>
      )}

      {/*  МОДАЛКА СОЗДАНИЯ/РЕДАКТИРОВАНИЯ ГРУППЫ  */}
      <Modal
        open={isGroupModalOpen}
        onCancel={() => setGroupModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.groupModal}
      >
        <Flex vertical gap={16} className={styles.modalContentPadding}>
          <h3>{groupForm.id ? 'Редактирование группы' : 'Создание группы'}</h3>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Название группы</label>
            <Input
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
              className={styles.input}
              placeholder="Введите название"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Тип группы</label>
            <BaseSelect
              variant="light"
              value={groupForm.type}
              onChange={(value) =>
                setGroupForm({ ...groupForm, type: value as 'client' | 'system' })
              }
              options={[
                { value: 'client', label: 'Клиентская' },
                { value: 'system', label: 'Системная' },
              ]}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Цвет</label>
            <input
              type="color"
              value={groupForm.color}
              onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })}
              className={styles.nativeColorInput}
            />
          </div>

          <BlueButton
            text="Сохранить группу"
            onClick={handleSaveGroup}
            disabled={!groupForm.name.trim()}
          />
        </Flex>
      </Modal>

      {/*  МОДАЛКА УДАЛЕНИЯ ГРУППЫ  */}
      <Modal
        open={isDeleteGroupModalOpen}
        onCancel={() => setDeleteGroupModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.deleteModal}
      >
        <Flex vertical align="center" className={styles.deleteModalContent}>
          <h3>Удаление группы</h3>
          <p>Это действие необратимо. Группа будет удалена.</p>
          <Button danger type="primary" className={styles.deleteButton} onClick={handleDeleteGroup}>
            Удалить группу
          </Button>
          <button
            type="button"
            onClick={() => setDeleteGroupModalOpen(false)}
            className={styles.cancelDelete}
          >
            Отменить удаление
          </button>
        </Flex>
      </Modal>

      {/*  МОДАЛКА ДОБАВЛЕНИЯ МАРКЕРОВ  */}
      <Modal
        open={isGroupMarkersModalOpen}
        onCancel={() => setGroupMarkersModalOpen(false)}
        footer={null}
        centered
        destroyOnClose
        className={styles.groupModal}
      >
        <Flex vertical className={styles.modalContentPadding}>
          <h3 style={{ marginBottom: 12 }}>Выберите маркеры для группы</h3>
          <div className={styles.groupMarkersList}>
            {/* Показываем маркеры того же типа, что и сама группа */}
            {markerItems
              .filter((m) => m.markerType === activeGroup?.type)
              .map((marker) => (
                <Checkbox
                  key={marker.apiId}
                  checked={selectedGroupMarkers.includes(Number(marker.apiId))}
                  onChange={(e) => {
                    const id = Number(marker.apiId);
                    if (e.target.checked) {
                      setSelectedGroupMarkers((prev) => [...prev, id]);
                    } else {
                      setSelectedGroupMarkers((prev) => prev.filter((i) => i !== id));
                    }
                  }}
                  className={styles.groupMarkerCheckbox}
                >
                  <span className={styles.colorTag} style={getMarkerTagStyle(marker.colorToken)}>
                    {marker.title}
                  </span>
                </Checkbox>
              ))}
          </div>

          <Flex align="center" gap={12} style={{ marginTop: 16 }}>
            <BlueButton text="Сохранить изменения" onClick={handleSaveGroupMarkers} />
            <button
              type="button"
              className={styles.cancelDelete}
              onClick={() => setGroupMarkersModalOpen(false)}
            >
              Отмена
            </button>
          </Flex>
        </Flex>
      </Modal>
    </PageContainer>
  );

  const renderChecklistsList = () => (
    <PageContainer className={styles.page}>
      <Flex className={styles.headerRow} align="center" justify="space-between">
        <PageTitle text="Настройки" />
        {renderTopTabs()}
      </Flex>

      <Flex className={styles.sectionHeaderRow} align="center" justify="space-between">
        <h2 className={styles.sectionTitleCompact}>Настройка чек-листов</h2>
        <BlueButton
          text="Создать новый чек-лист"
          icon={<PlusOutlined />}
          onClick={() => navigate('/settings/checklists/new/edit')}
        />
      </Flex>

      <Flex className={styles.actionsRow} align="center" justify="space-between">
        <div className={styles.filtersRow}>
          {renderFilterShell(
            iconSrc.checklist,
            '',
            <CustomSelect
              options={checklistNameOptions}
              multiple
              value={checklistFilterNames}
              onChange={(value) => setChecklistFilterNames(value as string[])}
              placeholder="Название чек-листа"
              searchable
              width="210px"
              isEmbedded
            />,
          )}

          {renderFilterShell(
            iconSrc.dateFrom,
            '',
            <DatePicker
              value={checklistStartDate}
              onChange={setChecklistStartDate}
              format="DD/MM/YY"
              suffixIcon={null}
              className={styles.checklistDateFilter}
              popupClassName={styles.settingsDatePopup}
              placeholder="Дата начала"
            />,
          )}

          {renderFilterShell(
            iconSrc.dateTo,
            '',
            <DatePicker
              value={checklistEndDate}
              onChange={setChecklistEndDate}
              format="DD/MM/YY"
              suffixIcon={null}
              className={styles.checklistDateFilter}
              popupClassName={styles.settingsDatePopup}
              placeholder="Дата завершения"
            />,
          )}
        </div>
      </Flex>

      {renderFeedback()}

      <Flex align="center" justify="space-between" className={styles.listHeaderRow}>
        <h3 className={styles.listTitle}>Список чек-листов</h3>
        <Input
          value={checklistSearch}
          onChange={(event) => setChecklistSearch(event.target.value)}
          placeholder="Поиск по названию"
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </Flex>

      {checklistsLoading ? (
        <div className={styles.loaderWrap}>
          <Spin />
        </div>
      ) : (
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
                  <img alt="редактировать" src="/icons/edit.svg" />
                </button>
              </div>

              <div className={styles.checklistMetaRow}>
                <span>Порог срабатывания</span>
                <b>{item.threshold}</b>
              </div>
              <div className={styles.checklistMetaRow}>
                <span>Маркеры</span>
                <b>{item.markersCount}</b>
              </div>

              <div className={styles.divider}></div>

              <div
                className={`${styles.checklistScoresWrap} ${checklistCardScrollState[item.id]?.top ? styles.scrollFadeTop : ''} ${checklistCardScrollState[item.id]?.bottom ? styles.scrollFadeBottom : ''}`}
              >
                <div
                  ref={(node) => {
                    checklistScoreRefs.current[item.id] = node;
                  }}
                  className={styles.checklistScores}
                  onScroll={(event) => handleChecklistScoresScroll(item.id, event.currentTarget)}
                >
                  {item.markerScores.length ? (
                    item.markerScores.map((scoreItem) => (
                      <div key={`${item.id}-${scoreItem.id}`} className={styles.scoreRow}>
                        <span>{scoreItem.title}</span>
                        <b
                          className={
                            scoreItem.score >= 0 ? styles.scorePositive : styles.scoreNegative
                          }
                        >
                          {scoreSign(scoreItem.score)}
                        </b>
                      </div>
                    ))
                  ) : (
                    <span className={styles.emptyHint}>Маркеры не добавлены</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
            <span className={styles.currentCrumb}>
              {isNewChecklist ? 'Создание' : 'Редактирование'}
            </span>
          </div>
          <PageTitle text={isNewChecklist ? 'Создание чек-листа' : 'Редактирование чек-листа'} />
        </div>
        <BlueButton
          text={checklistSaving ? 'Сохраняем...' : 'Сохранить изменения'}
          icon={<img alt="сохранить" src="/icons/save.svg" />}
          onClick={handleSaveChecklist}
          disabled={checklistSaving || checklistDeleting || !editChecklistName.trim()}
        />
      </Flex>

      {renderFeedback()}

      {!isNewChecklist && checklistsLoading && !checklist.raw ? (
        <div className={styles.loaderWrap}>
          <Spin />
        </div>
      ) : (
        <div className={styles.checklistEditGrid}>
          <div className={styles.column}>
            <h3 className={styles.blockTitle}>Общие данные</h3>

            <div className={styles.checklistNameRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Название</label>
                <div className={styles.counterField}>
                  <Input
                    value={editChecklistName}
                    onChange={(event) => setEditChecklistName(event.target.value)}
                    maxLength={30}
                    className={`${styles.input} ${showValidationErrors && !editChecklistName.trim() ? styles.inputError : ''}`}
                    status={showValidationErrors && !editChecklistName.trim() ? 'error' : undefined}
                  />
                  <span>{editChecklistName.length}/30</span>
                </div>
                {showValidationErrors && !editChecklistName.trim() && (
                  <span className={styles.errorText}>Введите название чек-листа</span>
                )}
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
                  onClick={handleAddMarkersClick}
                  disabled={checklistSaving}
                />
              </Flex>
              <div className={styles.markersInlineList}>
                {checklist.markerScores.length ? (
                  <>
                    {(showAllChecklistMarkers
                      ? checklist.markerScores
                      : checklist.markerScores.slice(0, 6)
                    ).map((item) => (
                      <div key={item.id} className={styles.inlineMarkerRow}>
                        <span>{scoreSign(item.score)}</span>
                        <span
                          className={styles.colorTag}
                          style={getMarkerTagStyle(item.colorToken)}
                        >
                          {item.title}
                        </span>
                      </div>
                    ))}
                    {checklist.markerScores.length > 6 && !showAllChecklistMarkers && (
                      <button
                        type="button"
                        className={styles.moreCounterButton}
                        onClick={() => setShowAllChecklistMarkers(true)}
                      >
                        <span>Еще</span>
                        <span className={styles.moreCounterBadge}>
                          {checklist.markerScores.length - 6}
                        </span>
                      </button>
                    )}
                    {checklist.markerScores.length > 6 && showAllChecklistMarkers && (
                      <button
                        type="button"
                        className={styles.collapseMarkersButton}
                        onClick={() => setShowAllChecklistMarkers(false)}
                      >
                        Свернуть список
                      </button>
                    )}
                  </>
                ) : (
                  <span className={styles.emptyHint}>Пока нет добавленных маркеров</span>
                )}
              </div>
            </div>

            {/* <div className={styles.editBlockCard}>
              <Flex justify="space-between" align="center" className={styles.editBlockHeader}>
                <h4>Категории</h4>
                <BlueButton
                  text="Добавить категории"
                  icon={<PlusOutlined />}
                  onClick={() => setCategoriesModalOpen(true)}
                />
              </Flex>
              <div className={styles.categoryListPreview}>
                <span className={styles.moreCounter}>
                  Сейчас привязано: {checklist.categoriesCount}
                </span>
              </div>
            </div> */}

            <div className={styles.deleteBlockCard}>
              <div>
                <h4>Удаление чек-листа</h4>
                <p>Это действие необратимо.</p>
                <p>Чек-лист будет удален без возможности восстановления.</p>
              </div>

              <Button
                danger
                type="primary"
                className={styles.deleteButton}
                icon={<DeleteOutlined />}
                onClick={() => setDeleteChecklistModalOpen(true)}
                disabled={isNewChecklist || checklistDeleting || checklist.apiId == null}
              >
                Удалить чек-лист
              </Button>
            </div>
          </div>

          <div className={styles.periodColumn}>
            <div className={styles.periodHeaderRow}>
              <h3 className={styles.blockTitle}>Период</h3>

              <div className={styles.counterBadge}>
                {formatApiDate(editChecklistPeriod[0])} - {formatApiDate(editChecklistPeriod[1])}
              </div>
            </div>
            <StaticRangePicker
              value={editChecklistPeriod}
              onChange={onChecklistPeriodChange}
              format="DD/MM/YY"
              separator={<span className={styles.periodSeparator}>-</span>}
              className={styles.periodPicker}
              popupClassName={styles.periodPopup}
            />
          </div>
        </div>
      )}

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
          <Button
            danger
            type="primary"
            className={styles.deleteButton}
            onClick={handleDeleteChecklist}
            loading={checklistDeleting}
          >
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

      {/* <Modal
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
            <h3>Выберите категории</h3>
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
      </Modal> */}
    </PageContainer>
  );

  const renderChecklistMarkers = () => (
    <PageContainer className={styles.page}>
      <div>
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
        </div>

        <Flex className={styles.headerRow} align="center" justify="space-between">
          <PageTitle text={`Добавление маркеров в чек-лист “${checklist.title}”`} />
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
      </div>

      {renderFeedback()}

      <div className={styles.markerAssignTable}>
        <div className={styles.markerAssignHeader}>
          <span></span>
          <span>Маркер</span>
          <span>Вес</span>
          <span>Реверс</span>
        </div>

        {markersLoading ? (
          <div className={styles.loaderWrap}>
            <Spin />
          </div>
        ) : checklistMarkerRows.length ? (
          checklistMarkerRows.map((row) => (
            <div key={row.rowId} className={styles.markerAssignRow}>
              <Checkbox
                checked={selectedMarkerRows.includes(row.rowId)}
                onChange={() => toggleMarkerRowSelection(row.rowId)}
              />

              <div className={styles.markerAssignNameCell}>
                <span className={styles.colorTag} style={getMarkerTagStyle(row.colorToken)}>
                  {row.title}
                </span>
              </div>

              <div className={styles.rowWeightControl}>
                <button type="button" onClick={() => changeMarkerRowWeight(row.rowId, -1)}>
                  <MinusCircleFilled />
                </button>
                <span>{scoreSign(markerWeights[row.rowId] ?? row.defaultWeight)}</span>
                <button type="button" onClick={() => changeMarkerRowWeight(row.rowId, 1)}>
                  <PlusCircleFilled />
                </button>
              </div>

              <Switch
                checked={markerReverseMap[row.rowId] ?? row.defaultReverse}
                onChange={() => toggleMarkerRowReverse(row.rowId)}
                className={styles.markerAssignSwitch}
                size="small"
              />
            </div>
          ))
        ) : (
          <div className={styles.loaderWrap}>
            <span className={styles.emptyHint}>Нет маркеров для добавления</span>
          </div>
        )}
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
              text={checklistSaving ? 'Сохраняем...' : 'Сохранить изменения'}
              icon={<img alt="сохранить" src="/icons/save.svg" />}
              onClick={handleSaveChecklist}
              disabled={checklistSaving || checklistDeleting}
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
            text={checklistSaving ? 'Сохраняем...' : 'Сохранить изменения'}
            onClick={() => {
              setUnsavedModalOpen(false);
              void handleSaveChecklistMarkers();
            }}
            disabled={checklistSaving || !checklistMarkerRows.length}
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
