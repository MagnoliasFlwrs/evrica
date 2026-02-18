import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosInstanceAll, baseAuthUrl} from "../store";

// Интерфейсы для данных
interface AppointmentsData {
    targeted_communications: number;
    next_contact_assigned: number;
    percentage_of_appointments_made: number;
}

interface DirectionsData {
    targeted_communications: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
}

interface EmployeeReportItem {
    name: string;
    total_calls: number;
    next_contact_assigned: number;
    not_next_contact_assigned: number;
    percentage_of_appointments_made: number;
    meeting: number;
    call_or_messenger: number;
    not_defined: number;
    call_share: number;
    quality: number;
    kpi: number;
}

interface ReportData {
    number_of_appointments_and_calls: AppointmentsData;
    distribution_by_directions: DirectionsData;
    // employee_report: EmployeeReportItem[];
}

interface AnalyticsState2 {
    error: boolean;
    loading: boolean;
    reportTotalData: ReportData | null;
    setError: (value: boolean) => void;
    clearReportTotalData: () => void;
    setPage: (page:number) => void;
    setPageLimit: (newLimit:number) => void;
    setManagers: (arr:string []) => void;
    setSort: (value:string) => void;
    setGeneralManagerReportsObj: (dateFrom:string,dateTo:string,categoryId:number, orgId:number)=> void;
    getReportTotalData: (dateFrom:string, dateTo:string, categoryId:number|string, orgId : number|string) => Promise<void>;
    getManagersList: (dateFrom:string, dateTo:string, categoryId:number|string, orgId : number|string) => Promise<void>;
    getManagersReport: () => Promise<void>;
    managersList: null | {} | []
    managersReportData: null | {} | [],
    managerReportsObj: {
        date_from: string,
        date_to: string,
        category_id:number|null,
        org_id : number|string|null,
        page: number,
        limit: number,
        managers: string []
    }
}

export const useAnalyticsStore2 = create<AnalyticsState2>()(
    persist(
        (set, get) => ({
            error: false,
            loading: false,
            reportTotalData: null,
            managersList:null,
            managersReportData:null,
            managerReportsObj: {
                date_from: '',
                date_to: '',
                category_id: null,
                org_id: null,
                page:1,
                limit:20,
                sort:'kpi',
                managers:[]
            },
            getManagersReport: async () => {
                set({ loading: true, error: false });
                try {
                    const body =  get().managerReportsObj
                    const res = await axiosInstanceAll.post(
                        `${baseAuthUrl}/proxy-dashboard/get-make-an-appointment-manager`,
                        body,
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
                            managersReportData: res.data.data
                        });
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                    console.error('Ошибка при получении списка менеджеров:', error);
                }
            },
            setError: (value: boolean) => set({ error: value }),
            clearReportTotalData: () => set({ reportTotalData: null }),
            getReportTotalData: async (dateFrom: string, dateTo: string, categoryId: number | string, orgId: number | string) => {
                set({ loading: true, error: false });
                try {
                    const body = {
                        date_from: dateFrom,
                        date_to: dateTo,
                        category_id: categoryId,
                        org_id: orgId
                    };

                    const res = await axiosInstanceAll.post(
                        `${baseAuthUrl}/proxy-dashboard/get-make-an-appointment-total`,
                        body,
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
                            reportTotalData: res.data.data
                        });
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                    console.error('Ошибка при получении отчета:', error);
                }
            },
            getManagersList: async (dateFrom: string, dateTo: string, categoryId: number | string, orgId: number | string) => {
                set({ loading: true, error: false });
                try {
                    const body = {
                        date_from: dateFrom,
                        date_to: dateTo,
                        category_id: categoryId,
                        org_id: orgId,
                        target:true
                    };
                    const res = await axiosInstanceAll.post(
                        `${baseAuthUrl}/proxy-dashboard/get-managers`,
                        body,
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
                            managersList: res.data.data
                        });
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                    });
                    console.error('Ошибка при получении списка менеджеров:', error);
                }
            },
            setPage: (newPage) =>
                set((state) => ({
                    managerReportsObj: { ...state.managerReportsObj, page: newPage },
                })),
            setPageLimit: (newLimit) =>
                set((state) => ({
                    managerReportsObj: { ...state.managerReportsObj, limit: newLimit },
                })),
            setManagers: (arr) =>
                set((state) => ({
                    managerReportsObj: { ...state.managerReportsObj, managers: arr },
                })),
            setSort: (value) =>
                set((state) => ({
                    managerReportsObj: { ...state.managerReportsObj, sort: value },
                })),
            setGeneralManagerReportsObj: (dateFrom:string,dateTo:string,categoryId:number, orgId:number) =>
                set((state) => ({
                    managerReportsObj: {
                        ...state.managerReportsObj,
                        date_to: dateTo,
                        date_from: dateFrom,
                        category_id: categoryId ,
                        org_id: orgId
                    },
                })),

        }),
        {
            name: 'analytics2'
        }
    )
);