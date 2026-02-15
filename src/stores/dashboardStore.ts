import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {axiosInstanceAll, baseAuthUrl} from "../store";
import {DashboardStoreTypes} from "./types/dashboardStoreTypes";

export const useDashboardStore = create(
    persist<DashboardStoreTypes>(
        (set, get) => ({
            error: false,
            loading: false,
            riskOfLosingAClient:null,
            whoIsControlOfTheConversation:null,
            callsQuality:null,
            employeeDidntHandleObjection:null,
            dealProbabilityLastDays:null,
            problemCallsPriorityLastDays:null,
            getRiskOfLosingAClient:async (orgId:string | number , days :number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/proxy-dashboard/get-risk-of-losing-a-client-where-is-the-client-category-target?org_id=${orgId}&days=${days}`,
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
                            riskOfLosingAClient:res.data.data
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
            getWhoIsControlOfTheConversation:async (orgId:string | number , days :number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/proxy-dashboard/get-who-is-in-control-of-the-conversation-where-is-the-client-category-target?org_id=${orgId}&days=${days}`,
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
                            whoIsControlOfTheConversation:res.data.data
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
            getCallsQualityLastDays:async (orgId:string | number , days :number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/proxy-dashboard/get-call-quality-last-days-where-is-the-client-category-target?org_id=${orgId}&days=${days}`,
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
                            callsQuality:res.data.data
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
            getEmployeeDidntHandleObjection:async (orgId:string | number , days :number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/proxy-dashboard/get-employee-didnt-handle-objection-where-is-the-client-category-target?org_id=${orgId}&days=${days}`,
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
                            employeeDidntHandleObjection:res.data.data
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
            getDealProbabilityLastDays:async (orgId:string | number , days :number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/proxy-dashboard/get-deal-probability-last-days-where-is-the-client-category-target?org_id=${orgId}&days=${days}`,
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
                            dealProbabilityLastDays:res.data.data
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
            getProblemCallsPriorityLastDays:async (orgId:string | number , days :number) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/proxy-dashboard/get-problem-calls-priority-last-days-where-is-the-client-category-target?org_id=${orgId}&days=${days}`,
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
                            problemCallsPriorityLastDays:res.data.data
                        });

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                }
            }

        }),
            {
                name: 'dashboard',
            }
    ),
);