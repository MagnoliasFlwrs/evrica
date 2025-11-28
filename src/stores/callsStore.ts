import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {axiosInstanceAuth, baseAuthUrl} from "../store";
import qs from 'qs';
import {CallsState} from "./types/callsStoreTypes";



export const useCallsStore = create(
    persist<CallsState>(
        (set, get) => ({
            error: false,
            loading: false,
            pendingCalls: [],
            categoryCallsListObj: {
                filters: {
                    call_types: [],
                    employees: [],
                    clients: [],
                    call_is_checked_statuses: [],
                    checklist_statuses: [],
                    call_time: {
                        to: null,
                        from: null
                    },
                    call_time_outs: {
                        to: null,
                        from: null
                    },
                    checklist_score_vector: null,
                    checklist_score_vector_value: null,
                    client_phone: null,
                    worked_dictionaries: [],
                },
                category_id: null,
                page: 1,
                per_page: 10,
                date_start: null,
                date_end: null,
            },
            callsCategories: [],
            callsByCategory: null,
            checkListsByIdObj: {
                category_id:'',
                date_start: 1762117201,
                date_end: 1762203600
            },
            checkListsByIdList:[],
            dictionariesByIdList:[],
            currentCallId:null,
            currentCallInfo:null,
            promptList:[],
            aiJsonList:[],
            setError: (value: boolean) => set({ error: value }),
            getPendingCalls: async () => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/organization/get-pending-calls`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );

                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            pendingCalls: res.data
                        });

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            getCallsCategories: async () => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/location`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );

                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            callsCategories: res.data.data
                        });

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            getCallsByCategoryId: async () => {
                set({ loading: true, error: false });
                try {
                    const { categoryCallsListObj } = get();

                    const queryParams = {
                        filters: JSON.stringify(categoryCallsListObj.filters),
                        category_id: categoryCallsListObj.category_id,
                        page: categoryCallsListObj.page,
                        'per-page': categoryCallsListObj.per_page,
                        date_start: categoryCallsListObj.date_start,
                        date_end: categoryCallsListObj.date_end,
                    };

                    const queryString = qs.stringify(queryParams, {
                        arrayFormat: 'indices',
                        encode: false
                    });

                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/category/get-category-calls?${queryString}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );

                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            callsByCategory: res.data
                        });

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            setCurrentCallId: (id: number | string | null) => set({currentCallId: id}),
            setCategoryId: (id: number | string) =>
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        category_id: id
                    },
                    checkListsByIdObj: {
                        ...state.checkListsByIdObj,
                        category_id: id
                    },
                })),
            setCategoryCallsListObjPage: (page: number ) => {
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        page: page
                    },
                }));
                get().getCallsByCategoryId();
            },
            setCategoryCallsListObjPerPage: (count: number ) => {
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        per_page: count
                    },
                }));
                get().getCallsByCategoryId();
            },

            getChecklistsByCategoryId: async () => {
                set({ loading: true, error: false });
                try {
                    const { checkListsByIdObj } = get();

                    const queryString = qs.stringify(checkListsByIdObj, {
                        arrayFormat: 'indices',
                        encode: false
                    });
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/category/get-category-checklists?${queryString}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );
                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            checkListsByIdList: res.data.data
                        });

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            getDictionariesByCategoryId: async () => {
                set({ loading: true, error: false });
                try {
                    const { checkListsByIdObj } = get();

                    const queryString = qs.stringify(checkListsByIdObj, {
                        arrayFormat: 'indices',
                        encode: false
                    });
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/category/get-category-dictionaries?${queryString}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );
                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            dictionariesByIdList: res.data.data
                        });

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            getCurrentCallInfo: async (id : string | null | number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/category/get-category-call?call_id=${id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );
                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            currentCallInfo: res.data.data
                        });

                        return res.data.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            getPromptList: async (id : string | null | number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/proxy/get-prompt-list?org_id=${id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );
                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            promptList: res.data.data
                        });

                        return res.data.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            getAiJsonList: async (orgId : string | null | number , callInfoId :number | undefined ) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/proxy/get-prompt-result-by-call-info-id?org_id=${orgId}&call_info_id=${callInfoId}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                accept: '*/*',
                                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                            },
                        },
                    );
                    if (res.status === 200) {
                        set({
                            loading: false,
                            error: false,
                            aiJsonList: res.data.data
                        });

                        return res.data.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            },
            setCategoryCallsFilterDate: (startDate: null | number, endDate: null | number) => {
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        date_start: startDate,
                        date_end: endDate,
                    }
                }))
            }

        }),
        {
            name: 'calls',
        }
    ),
);