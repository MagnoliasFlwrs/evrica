import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {axiosInstanceAll, axiosInstanceAuth, baseAuthUrl} from "../store";
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
            categoriesCheckListsObj: {
                category_id:'',
                date_start: 1762117201,
                date_end: 1762203600
            },
            categoriesDictionariesObj: {
                category_id:'',
                date_start: 1762117201,
                date_end: 1762203600
            },
            categoriesDictionariesList:{},
            categoriesChecklistsList:[],
            checkListsByIdList:[],
            dictionariesByIdList:[],
            currentCallId:null,
            currentCallInfo:null,
            promptList:[],
            aiJsonList:[],
            callsByCategories:[],
            categoriesIds:null,
            setError: (value: boolean) => set({ error: value }),
            getPendingCalls: async () => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
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
                    const res = await axiosInstanceAll.get(
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
            // getCallsByCategories: async () => {
            //     set({ loading: true, error: false });
            //     try {
            //         const { categoriesIds } = get();
            //         const { categoryCallsListObj } = get();
            //
            //         const queryParams = {
            //             // filters: JSON.stringify(categoryCallsListObj.filters),
            //             categories: categoryCallsListObj?.categories?.join(','),
            //             page: categoryCallsListObj.page,
            //             'per-page': categoryCallsListObj.per_page,
            //             date_start: categoryCallsListObj.date_start,
            //             date_end: categoryCallsListObj.date_end,
            //         };
            //         const queryString = qs.stringify(queryParams, {
            //             arrayFormat: 'indices',
            //             encode: false
            //         });
            //
            //         const res = await axiosInstanceAll.get(
            //             `${baseAuthUrl}/category/get-categories-with-calls-and-discts-and-checklists?${queryString}`,
            //             {
            //                 headers: {
            //                     'Content-Type': 'application/json',
            //                     accept: '*/*',
            //                     authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            //                 },
            //             },
            //         );
            //
            //         if (res.status === 200) {
            //             set({
            //                 loading: false,
            //                 error: false,
            //                 callsByCategories: res.data
            //             });
            //
            //             return res.data;
            //         }
            //     } catch (error) {
            //         set({
            //             error: true,
            //             loading: false,
            //         });
            //     }
            // },
            setCategoriesIds: (arr: number[]) =>
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        categories: arr
                    },
                })),
            setCurrentCallId: (id: number | string | null) => set({currentCallId: id}),
            setCategoryId: (id: number | string | null) =>
                set((state) => ({
                    checkListsByIdObj: {
                        ...state.checkListsByIdObj,
                        category_id: id
                    },
                    categoriesCheckListsObj: {
                        ...state.categoriesCheckListsObj,
                        category_id: id
                    },
                    categoriesDictionariesObj: {
                        ...state.categoriesDictionariesObj,
                        category_id: id
                    },
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        category_id: id
                    }
                })),
            setCategoryCallsListObjPage: (page: number ) => {
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        page: page
                    },
                }));
                // get().getCallsByCategories();
            },
            setCategoryCallsListObjPerPage: (count: number ) => {
                set((state) => ({
                    categoryCallsListObj: {
                        ...state.categoryCallsListObj,
                        per_page: count
                    },
                }));
                // get().getCallsByCategories();
            },
            getChecklistsByCategoryId: async () => {
                set({ loading: true, error: false });
                try {
                    const { checkListsByIdObj } = get();

                    const queryString = qs.stringify(checkListsByIdObj, {
                        arrayFormat: 'indices',
                        encode: false
                    });
                    const res = await axiosInstanceAll.get(
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
            getCategoriesCheckLists: async () => {
                set({ loading: true, error: false });
                try {
                    const { categoriesCheckListsObj } = get();

                    const queryString = qs.stringify(categoriesCheckListsObj, {
                        arrayFormat: 'indices',
                        encode: false
                    });
                    const res = await axiosInstanceAll.get(
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
                            categoriesChecklistsList: res.data.data
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
                    const res = await axiosInstanceAll.get(
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
            getCategoriesDictionaries: async () => {
                set({ loading: true, error: false });
                try {
                    const { categoriesDictionariesObj } = get();

                    const queryString = qs.stringify(categoriesDictionariesObj, {
                        arrayFormat: 'indices',
                        encode: false
                    });
                    const res = await axiosInstanceAll.get(
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
                            categoriesDictionariesList: res.data.data
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
                    const res = await axiosInstanceAll.get(
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
                    const res = await axiosInstanceAll.get(
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
                    const res = await axiosInstanceAll.get(
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
                    },
                    categoriesCheckListsObj: {
                        ...state.categoriesCheckListsObj,
                        date_start: startDate,
                        date_end: endDate,
                    },
                    categoriesDictionariesObj: {
                        ...state.categoriesDictionariesObj,
                        date_start: startDate,
                        date_end: endDate,
                    },

                }))
                // get().getCallsByCategories()
            },

        }),
        {
            name: 'calls',
        }
    ),
);