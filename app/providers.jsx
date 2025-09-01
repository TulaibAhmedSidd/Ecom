"use client";

import { AppContextProvider } from "@/context/AppContext";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("react-hot-toast").then(m => m.Toaster), {
    ssr: false,
});

export function Providers({ children }) {
    return (
        <>
            <Toaster />
            <AppContextProvider>
                {children}
            </AppContextProvider>
        </>
    );
}
