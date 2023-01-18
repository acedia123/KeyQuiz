import React, { Suspense } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';

import { privateRoutes, publicRoutes } from './app/routes';
import { ToastContextProvider } from './app/context/ToastContextProvider';
import { AuthContextProvider } from './app/context/AuthContextProvider';
import LoadingSpinier from './app/components/Share/LoadingSpinier';
import { getUserFromLocalStorage } from './app/constants/functions';
import { routes } from './app/configs';

function DefaultLayout({ children }) {
    return <div>{children}</div>;
}

export default function App() {
    return (
        <AuthContextProvider>
            <ToastContextProvider>
                <Routes>
                    {privateRoutes.map((route, index) => {
                        const Layout = route.layout === null ? DefaultLayout : route.layout;
                        const Page = route.component;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    getUserFromLocalStorage() ? (
                                        <Layout>
                                            <Suspense fallback={<LoadingSpinier />}>
                                                <Page />
                                            </Suspense>
                                        </Layout>
                                    ) : (
                                        <Navigate to={routes.login} replace={true} />
                                    )
                                }
                            />
                        );
                    })}
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
