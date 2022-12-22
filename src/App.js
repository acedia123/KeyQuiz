import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { publicRoutes } from './app/routes';
import { ToastContextProvider } from './app/context/ToastContextProvider';
import { AuthContextProvider } from './app/context/AuthContextProvider';
import { Suspense } from 'react';
import LoadingSpinier from './app/components/Share/LoadingSpinier';

function DefaultLayout({ children }) {
    return <div>{children}</div>;
}

export default function App() {
    return (
        <AuthContextProvider>
            <ToastContextProvider>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout === null ? DefaultLayout : route.layout;
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Suspense fallback={<LoadingSpinier />}>
                                            <Page />
                                        </Suspense>
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </ToastContextProvider>
        </AuthContextProvider>
    );
}