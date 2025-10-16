import { create } from 'zustand';
import axios from 'axios';
import { Mutex } from 'async-mutex';
import {persist} from "zustand/middleware";

const mutex = new Mutex();
let refreshTokenPromise = null;
let isRefreshingToken = false;
let isSignOut = false;


const baseAuthUrl = process.env.REACT_APP_AUTH_URL || 'https://api.evrika360.com';


const base64urlDecode = (str) => {
    return decodeURIComponent(
        atob(str.replace(/-/g, '+').replace(/_/g, '/'))
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
};

const refreshToken = async () => {
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
            if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
            }
            if (res.data.refreshToken) {
                localStorage.setItem('refreshToken', res.data.refreshToken);
            }
            return res.data.accessToken;
        }
    } catch (error) {

        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth');
        throw error;
    } finally {
        isRefreshingToken = false;
    }
};

const axiosInstanceAuth = axios.create();
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
                    // Помечаем запрос как перезапущенный
                    error.config._retry = true;
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstanceAll(error.config);
                }
            } catch (refreshError) {
                // Полная очистка при ошибке обновления
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

export const useAuth = create(
        persist(
            (set, get) => ({
                error: null,
                isAuth: false,
                loading: false,
                accessToken: null,
                user: null,

                setError: (value) => set({ error: value }),

                authUser: async (userData) => {
                    set({ loading: true, error: null });
                    try {
                        const res = await axiosInstanceAuth.post(
                            `${baseAuthUrl}/login`,
                            {
                                password: userData.password,
                                login: userData.login,
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'application/json',
                                    accept: '*/*',
                                },
                            },
                        );

                        if (res.status === 200 && res.data.response?.data) {
                            const authData = res.data.response.data;

                            if (authData.accessToken) {
                                localStorage.setItem('accessToken', authData.accessToken);
                                set({
                                    isAuth: true,
                                    accessToken: authData.accessToken
                                });
                            }

                            if (authData.refreshToken) {
                                localStorage.setItem('refreshToken', authData.refreshToken);
                            }

                            // Декодируем пользователя из токена
                            const parts = authData.accessToken.split('.');
                            const user = JSON.parse(base64urlDecode(parts[1]));
                            set({ user, loading: false });
                            return user;
                        }
                        return res.data;
                    } catch (error) {
                        const errorMessage = error?.response?.data?.errors?.[0]?.message || error.message;
                        set({
                            error: errorMessage,
                            loading: false,
                            accessToken: null,
                            isAuth: false
                        });
                        return errorMessage;
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
                        error: null
                    });
                    isSignOut = false;
                },

                clearError: () => set({ error: null }),
            }),
            {
                name: 'auth',
                partialize: (state) => ({
                    isAuth: state.isAuth,
                    user: state.user,
                    accessToken: state.accessToken,
                }),
            },
        ),
);