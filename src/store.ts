import { create } from 'zustand';
import axios from 'axios';
import { persist } from "zustand/middleware";
import {Mutex} from "async-mutex";

export const baseAuthUrl = process.env.REACT_APP_AUTH_URL || 'https://api.evrika360.com/api';

export const axiosInstanceAuth = axios.create();
const axiosInstanceAll = axios.create();

// Fix: Add explicit type for refreshTokenPromise
let refreshTokenPromise: Promise<string | null> | null = null;
let isRefreshingToken = false;
let isSignOut = false;
const mutex = new Mutex();

const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const res = await axios.post(
                `${baseAuthUrl}/auth/get-auth-user-by-refresh-token`,
                { refreshToken },
                { withCredentials: true },
            );
            if (res.status === 200) {
                if ('accessToken' in res.data) {
                    localStorage.setItem('accessToken', res.data.accessToken);
                }
                if ('refreshToken' in res.data)
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                return res.data.accessToken;
            } else {
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('employee');
                localStorage.removeItem('maintenance');
                localStorage.removeItem('auth');
            }
        } else {
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('employee');
            localStorage.removeItem('maintenance');
            localStorage.removeItem('auth');

        }
        return null;
    } finally {
        isRefreshingToken = false;
    }
};

axiosInstanceAll.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstanceAll.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401 && !isSignOut) {
            const release = await mutex.acquire();
            try {
                if (!isRefreshingToken) {
                    isRefreshingToken = true;

                    if (!refreshTokenPromise) refreshTokenPromise = refreshToken();
                }
                const newAccessToken = await refreshTokenPromise;
                if (newAccessToken) {
                    const originalRequest = error.config;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } else {
                    refreshTokenPromise = null;
                    release();
                }
            } catch (refreshError) {
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('employee');
                localStorage.removeItem('maintenance');
                localStorage.removeItem('auth');
                localStorage.removeItem('conversationLog');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            } finally {
                refreshTokenPromise = null;
                release();
            }
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
                    const res = await axiosInstanceAuth.get(
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