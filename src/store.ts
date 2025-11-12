import { create } from 'zustand';
import axios from 'axios';
import { persist } from "zustand/middleware";

export const baseAuthUrl = process.env.REACT_APP_AUTH_URL || 'https://api.evrika360.com/api';

export const axiosInstanceAuth = axios.create();
const axiosInstanceAll = axios.create();

axiosInstanceAll.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {

            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('auth');
            localStorage.removeItem('analytics');
            localStorage.removeItem('calls');
            useAuth.getState().logout();

            window.location.href = '/auth';
            return Promise.reject(error);
        }
        return Promise.reject(error);
    },
);

export { axiosInstanceAll };

interface UserData {
    login: string;
    password: string;
}

interface AuthState {
    error: boolean;
    isAuth: boolean;
    loading: boolean;
    accessToken: string | null;
    user: any | null;
    setError: (value: boolean) => void;
    authUser: (userData: UserData) => Promise<any>;
    getAuthUser: () => Promise<any>;
    logout: () => void;
}

export const useAuth = create(
    persist<AuthState>(
        (set, get) => ({
            error: false,
            isAuth: false,
            loading: false,
            accessToken: null,
            user: null,
            setError: (value: boolean) => set({ error: value }),
            authUser: async (userData: UserData) => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAuth.post(
                        `${baseAuthUrl}/auth/login`,
                        {
                            login: userData.login,
                            password: userData.password,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );

                    if (res.status === 200) {
                        const authData = res.data.data;

                        if (authData.access_token) {
                            localStorage.setItem('accessToken', authData.access_token);
                            set({
                                isAuth: true,
                                accessToken: authData.access_token,
                                error: false,
                                loading: false
                            });
                        }

                        if (authData.refresh_token) {
                            localStorage.setItem('refreshToken', authData.refresh_token);
                        }

                        return res.data;
                    }
                } catch (error) {
                    set({
                        error: true,
                        loading: false,
                        accessToken: null,
                        isAuth: false
                    });
                }
            },
            getAuthUser: async () => {
                set({ loading: true, error: false });
                try {
                    const res = await axiosInstanceAll.get(
                        `${baseAuthUrl}/user/get-auth-user`,
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
                            user: res.data.data.user,
                            error: false,
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
            logout: () => {
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('auth');
                set({
                    isAuth: false,
                    accessToken: null,
                    user: null,
                    error: false,
                    loading: false
                });
            },
        }),
        {
            name: 'auth',
            partialize: (state) => ({
                isAuth: state.isAuth,
                user: state.user,
                accessToken: state.accessToken,
                error: state.error,
            } as any),
        }
    ),
);