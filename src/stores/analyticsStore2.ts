import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosInstanceAll, baseAuthUrl} from "../store";

interface AnalyticsState2 {
    error: boolean;
    loading: boolean;
    reportData:null | [] | {}
    setError: (value: boolean) => void;
    getReport: (dateFrom:string, dateTo:string, categoryId:number|string, orgId : number|string) => void;

}


export const useAnalyticsStore2 = create(
    persist<AnalyticsState2>(
        (set, get) => ({
            error: false,
            loading: false,
            setError: (value: boolean) => set({ error: value }),
            reportData:null,
            getReport:async (dateFrom:string, dateTo:string, categoryId:number|string, orgId : number|string) => {
                set({ loading: true, error: false });
                try {
                    const body = {
                        date_from: dateFrom,
                        date_to:dateTo,
                        category_id:categoryId,
                        org_id:orgId
                    }
                    const res = await axiosInstanceAll.get(

                        `${baseAuthUrl}/front-dashboard/make_an_appointment`,
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
                            reportData:res.data.data
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
            name: 'analytics2'
        }
    ),
);