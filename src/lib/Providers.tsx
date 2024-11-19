'use client'
import React from "react";
import { useRef } from 'react'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
/* import { NextUIProvider } from "@nextui-org/react"; */

import { makeStore, AppStore, persistor } from './Redux'

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode}) => {

    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    return (
        <Provider store={storeRef.current}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {children}
                    </LocalizationProvider>
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}