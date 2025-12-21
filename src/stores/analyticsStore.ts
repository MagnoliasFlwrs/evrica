import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {axiosInstanceAll, baseAuthUrl} from "../store";

interface AnalyticsState {
    error: boolean;
    loading: boolean;
    categoryId: string | number,
    agentName:string,
    setError: (value: boolean) => void;
    setCategoryId: (value: string | number) => void;
    setAgentName: (value: string) => void;
    allAgents:[];
    agentInfo: [] | null;
    getAllAgents: () => Promise<any>;
    getAgentInfo:(categoryId:string | number , agentName :string) => Promise<any>;

}

export const useAnalyticsStore = create(
    persist<AnalyticsState>(
        (set, get) => ({
            error: false,
            loading: false,
            analyticsListObj: {

            },
            agentInfo:null,
            categoryId: '',
            agentName:'',
            allAgents: [],
            setError: (value: boolean) => set({ error: value }),
            setAgentName: (value: string) => set({ agentName: value }),
            setCategoryId: (value: string | number) => set({ categoryId: value }),
            getAllAgents: async () => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
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
                }
            },
            getAgentInfo:async (categoryId:string | number , agentName :string) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/category/get-category-agent?category_id=${categoryId}&agent_name=${agentName}`,
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
                            agentInfo:res.data.data
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
            name: 'analytics'
        }
    ),
);