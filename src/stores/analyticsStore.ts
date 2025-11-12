import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {axiosInstanceAuth, baseAuthUrl} from "../store";

interface AnalyticsState {
    error: boolean;
    loading: boolean;
    setError: (value: boolean) => void;
    allAgents:[];
    getAllAgents: () => Promise<any>;

}

export const useAnalyticsStore = create(
    persist<AnalyticsState>(
        (set, get) => ({
            error: false,
            loading: false,
            analyticsListObj: {

            },
            allAgents: [],
            setError: (value: boolean) => set({ error: value }),
            getAllAgents: async () => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.get(
                        `${baseAuthUrl}/location/get-all-with-agents`,
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
                            allAgents:res.data.data
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
        }),
        {
            name: 'analytics',
            partialize: (state) => ({

            } as any),
        }
    ),
);