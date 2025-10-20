import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {axiosInstanceAuth, baseAuthUrl} from "../store";

interface CallsState {
    error: boolean;
    loading: boolean;
    pendingCalls:[];
    setError: (value: boolean) => void;
    getPendingCalls: () => Promise<any>;

}

export const useCallsStore = create(
    persist<CallsState>(
        (set, get) => ({
            error: false,
            loading: false,
            pendingCalls: [],
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
                            pendingCalls:res.data
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
            name: 'calls',
            partialize: (state) => ({

            } as any),
        }
    ),
);