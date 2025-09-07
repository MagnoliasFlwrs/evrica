import React, {Suspense} from 'react';
import './index.css';
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ErrorPage, MainLayout , CallsLayout} from "./routes/routesConfig/lazyComponents";
import {Spin} from "antd";
import CallsFilteredLayout from "./routes/CallsFilteredLayout";

const App = () => {
    const routes = [
        {
            path: '/',
            element: <MainLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/calls',
                    element: <CallsLayout />,
                },
                {
                    path: '/calls/filtered',
                    element: <CallsFilteredLayout/>
                }
            ]
        }
    ]

    const router = createBrowserRouter(routes);

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