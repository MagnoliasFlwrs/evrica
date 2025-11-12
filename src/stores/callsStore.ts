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
                per_page: 25
            },
            callsCategories: [],
            callsByCategory: null,
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
                    throw error;
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
                    throw error;
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
                    throw error;
                }
            },
            setCategoryId: (id: number | string) =>
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        category_id: id
                    },
                })),
        }),
        {
            name: 'calls',
            partialize: (state) => ({
                callsByCategory:state.callsByCategory,
                callsCategories:state.callsCategories,
            } as any),
        }
    ),
);