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
                    worked_dictionaries: []
                },
                category_id: null,
                page: 1,
                per_page: 10
            },
            callsCategories: [],
            callsByCategory: null,
            checkListsByIdObj: {
                category_id:'',
                date_start: 1762117201,
                date_end: 1762203600
            },
            checkListsByIdList:[],
            currentCallId:null,
            currentCallInfo:null,
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
                        'per-page': categoryCallsListObj.per_page
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
        }),
        {
            name: 'calls',
        }
    ),
);