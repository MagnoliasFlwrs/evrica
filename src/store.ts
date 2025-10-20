import { create } from 'zustand';
import axios from 'axios';
import { Mutex } from 'async-mutex';
import { persist, PersistOptions } from "zustand/middleware";

const mutex = new Mutex();
let refreshTokenPromise: Promise<string | null> | null = null;
let isRefreshingToken = false;
let isSignOut = false;

export const baseAuthUrl = process.env.REACT_APP_AUTH_URL || 'https://api.evrika360.com/api';

const base64urlDecode = (str: string): string => {
    return decodeURIComponent(
        atob(str.replace(/-/g, '+').replace(/_/g, '/'))
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
};

const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('Токен отсутствует в хранилище.');
        }

        const res = await axios.post(
            `${baseAuthUrl}/auth/refresh`,
            { refreshToken },
            { withCredentials: true },
        );

        if (res.status === 200) {
            if (res.data.data.access_token) {
                localStorage.setItem('accessToken', res.data.data.access_token);
            }
            if (res.data.data.refresh_token) {
                localStorage.setItem('refreshToken', res.data.data.refresh_token);
            }
            return res.data.data.access_token;
        }
        return null;
    } catch (error) {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth');
        throw error;
    } finally {
        isRefreshingToken = false;
    }
};

export const axiosInstanceAuth = axios.create();
const axiosInstanceAll = axios.create();

axiosInstanceAll.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !isSignOut && !error.config._retry) {
            const release = await mutex.acquire();
            try {
                if (!isRefreshingToken) {
                    isRefreshingToken = true;
                    refreshTokenPromise = refreshToken();
                }

                const newAccessToken = await refreshTokenPromise;

                if (newAccessToken) {
                    error.config._retry = true;
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstanceAll(error.config);
                }
            } catch (refreshError) {
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('auth');
                isSignOut = true;
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            } finally {
                refreshTokenPromise = null;
                isRefreshingToken = false;
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
                    throw error;
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
                    throw error;
                }
            },
            logout: () => {
                isSignOut = true;
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
                isSignOut = false;
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