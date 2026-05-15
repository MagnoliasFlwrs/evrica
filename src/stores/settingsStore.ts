import { create } from 'zustand';
import { axiosInstanceAll, baseAuthUrl } from '../store';

export type SettingsMarkerType = 'client' | 'system' | 'for_group';

export interface SettingsDictionaryApi {
  id: number | string;
  name?: string | null;
  description?: string | null;
  query?: string | null;
  reverse?: number | boolean | null;
  negative_weight?: number | null;
  positive_weight?: number | null;
  color_success?: string | null;
  color_reject?: string | null;
  search_in_channel_1?: number | boolean | null;
  search_in_channel_2?: number | boolean | null;
  search_in_call?: number | boolean | null;
  search_out_call?: number | boolean | null;
  is_valid?: number | boolean | null;
  type?: SettingsMarkerType | string | null;
  dictionary_type?: SettingsMarkerType | string | null;
  marker_type?: SettingsMarkerType | string | null;
  [key: string]: unknown;
}

export interface SettingsChecklistApi {
  id: number | string;
  name?: string | null;
  title?: string | null;
  threshold?: number | string | null;
  acceptance_percentage?: number | string | null;
  checklist_acceptance_percentage?: number | string | null;
  date_start?: string | number | null;
  date_end?: string | number | null;
  start_date?: string | number | null;
  end_date?: string | number | null;
  dictionaries?: unknown;
  categories?: unknown;
  [key: string]: unknown;
}

interface SettingsState {
  markers: SettingsDictionaryApi[];
  markerDetailsByKey: Record<string, SettingsDictionaryApi>;
  markersLoading: boolean;
  markerSaving: boolean;
  markerDeleting: boolean;
  markersError: string | null;
  checklists: SettingsChecklistApi[];
  checklistsLoading: boolean;
  checklistSaving: boolean;
  checklistDeleting: boolean;
  checklistsError: string | null;
  fetchMarkers: () => Promise<SettingsDictionaryApi[]>;
  fetchMarkerById: (
    id: number | string,
    type: SettingsMarkerType,
  ) => Promise<SettingsDictionaryApi | null>;
  saveMarker: (payload: Record<string, unknown>) => Promise<any>;
  deleteMarker: (id: number | string, type?: SettingsMarkerType) => Promise<boolean>;
  fetchChecklists: () => Promise<SettingsChecklistApi[]>;
  saveChecklist: (payload: Record<string, unknown>) => Promise<any>;
  deleteChecklist: (id: number | string) => Promise<boolean>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const toMarkerType = (value: unknown): SettingsMarkerType => {
  if (value === 'system' || value === 'client' || value === 'for_group') {
    return value;
  }
  return 'client';
};

const buildMarkerKey = (id: number | string, type: SettingsMarkerType) => `${type}:${id}`;

const extractData = (payload: any) => payload?.data?.data ?? payload?.data ?? payload;

const flattenMarkerResponse = (payload: unknown): SettingsDictionaryApi[] => {
  const data = extractData(payload);

  if (Array.isArray(data)) {
    return data.filter(isRecord) as SettingsDictionaryApi[];
  }

  if (!isRecord(data)) {
    return [];
  }

  const groupedEntries = Object.entries(data).filter(([, value]) => Array.isArray(value));

  if (groupedEntries.length) {
    return groupedEntries.flatMap(([group, value]) => {
      const type = toMarkerType(group);
      return (value as unknown[]).filter(isRecord).map((item) => ({
        ...item,
        type,
      })) as SettingsDictionaryApi[];
    });
  }

  return [];
};

const flattenChecklistResponse = (payload: unknown): SettingsChecklistApi[] => {
  const data = extractData(payload);

  if (Array.isArray(data)) {
    return data.filter(isRecord) as SettingsChecklistApi[];
  }

  if (isRecord(data)) {
    const nested = Object.values(data).find((value) => Array.isArray(value));
    if (Array.isArray(nested)) {
      return nested.filter(isRecord) as SettingsChecklistApi[];
    }
  }

  return [];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isRecord(error) && isRecord(error.response) && typeof error.response.data === 'string') {
    return error.response.data;
  }

  if (
    isRecord(error) &&
    isRecord(error.response) &&
    isRecord(error.response.data) &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  markers: [],
  markerDetailsByKey: {},
  markersLoading: false,
  markerSaving: false,
  markerDeleting: false,
  markersError: null,
  checklists: [],
  checklistsLoading: false,
  checklistSaving: false,
  checklistDeleting: false,
  checklistsError: null,

  fetchMarkers: async () => {
    set({ markersLoading: true, markersError: null });
    try {
      const res = await axiosInstanceAll.get(`${baseAuthUrl}/dictionary/`, {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const markers = flattenMarkerResponse(res);
      set({ markers, markersLoading: false, markersError: null });
      return markers;
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось загрузить маркеры');
      set({ markersLoading: false, markersError: message });
      return [];
    }
  },

  fetchMarkerById: async (id, type) => {
    try {
      const res = await axiosInstanceAll.get(
        `${baseAuthUrl}/dictionary/get-dictionary-information-by-periods?id=${id}&type=${type}`,
        {
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      const raw = extractData(res);
      const marker = isRecord(raw)
        ? ({
            ...raw,
            type,
          } as SettingsDictionaryApi)
        : null;

      if (marker) {
        set((state) => ({
          markerDetailsByKey: {
            ...state.markerDetailsByKey,
            [buildMarkerKey(id, type)]: marker,
          },
        }));
      }

      return marker;
    } catch {
      return null;
    }
  },

  saveMarker: async (payload) => {
    set({ markerSaving: true, markersError: null });
    try {
      const res = await axiosInstanceAll.post(`${baseAuthUrl}/dictionary/save`, payload, {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      set({ markerSaving: false, markersError: null });
      await get().fetchMarkers();
      return extractData(res);
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось сохранить маркер');
      set({ markerSaving: false, markersError: message });
      return null;
    }
  },

  deleteMarker: async (id, type) => {
    set({ markerDeleting: true, markersError: null });
    try {
      await axiosInstanceAll.post(
        `${baseAuthUrl}/dictionary/delete`,
        {
          id,
          type,
          dictionary_type: type,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      set({ markerDeleting: false, markersError: null });
      await get().fetchMarkers();
      return true;
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось удалить маркер');
      set({ markerDeleting: false, markersError: message });
      return false;
    }
  },

  fetchChecklists: async () => {
    set({ checklistsLoading: true, checklistsError: null });
    try {
      const res = await axiosInstanceAll.get(`${baseAuthUrl}/checklist/`, {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const checklists = flattenChecklistResponse(res);
      set({ checklists, checklistsLoading: false, checklistsError: null });
      return checklists;
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось загрузить чек-листы');
      set({ checklistsLoading: false, checklistsError: message });
      return [];
    }
  },

  saveChecklist: async (payload) => {
    set({ checklistSaving: true, checklistsError: null });
    try {
      const res = await axiosInstanceAll.post(`${baseAuthUrl}/checklist/save`, payload, {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      set({ checklistSaving: false, checklistsError: null });
      await get().fetchChecklists();
      return extractData(res);
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось сохранить чек-лист');
      set({ checklistSaving: false, checklistsError: message });
      return null;
    }
  },

  deleteChecklist: async (id) => {
    set({ checklistDeleting: true, checklistsError: null });
    try {
      await axiosInstanceAll.post(
        `${baseAuthUrl}/checklist/delete`,
        { id },
        {
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      set({ checklistDeleting: false, checklistsError: null });
      await get().fetchChecklists();
      return true;
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось удалить чек-лист');
      set({ checklistDeleting: false, checklistsError: message });
      return false;
    }
  },
}));
