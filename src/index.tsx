import React, {Suspense} from 'react';
import './index.css';
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {
    ErrorPage,
    MainLayout,
    CallsLayout,
    AnalyticsLayout,
    LoginLayout,
    AnalyticsReportLayout,
    DashboardLayout, AnalyticsLayout2
} from "./routes/routesConfig/lazyComponents";
import {Spin} from "antd";
import CallsFilteredLayout from "./routes/CallsFilteredLayout";
import CallSinglePageLayout from "./routes/CallSinglePageLayout";
import {useAuth} from "./store";

const App = () => {
    const isAuth = useAuth((state)=> state.isAuth);
    const accessToken = useAuth((state)=> state.accessToken);

    const accessTokenLS =  localStorage.getItem('accessToken');

    const initialRoutes = [
        {
            path: 'login',
            element: <LoginLayout />,
            errorElement: <ErrorPage />,
        },
        {
            path: '*',
            element: <LoginLayout />,
        },
    ];


    const routes = [
        {
            path: '/',
            element: <MainLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    index:true,
                    element: <DashboardLayout />,
                },
                {
                    path: '/dashboard',
                    element: <DashboardLayout />,
                },
                {
                    path: '/calls',
                    element: <CallsLayout />,
                },
                {
                    path: '/calls/filtered',
                    element: <CallsFilteredLayout/>
                },
                {
                    path: '/call/:id?',
                    element: <CallSinglePageLayout/>
                },
                {
                    path: '/analytics',
                    element: <AnalyticsLayout />,
                },
                {
                    path: '/analytics2',
                    element: <AnalyticsLayout2 />,
                },
                {
                    path: '/analytics-report',
                    element: <AnalyticsReportLayout />,
                },

            ]
        },
    ]

    const allRoutes = isAuth ? [...initialRoutes , ...routes] : [...initialRoutes]
    const router = createBrowserRouter(allRoutes);

    return <RouterProvider router={router} />;
};

const container = document.getElementById('root');

if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);

const contentStyle = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

root.render(
    <Suspense
        fallback={
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Spin tip="Загрузка..." size="large">
                    <div style={contentStyle}></div>
                </Spin>
            </div>
        }
    >
        <App />
    </Suspense>
);