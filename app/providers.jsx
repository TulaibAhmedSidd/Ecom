"use client";

import { AppContextProvider } from "@/context/AppContext";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
    return (
        <ClerkProvider>
            <Toaster />
            <AppContextProvider>
                {children}
            </AppContextProvider>
        </ClerkProvider>
    );
}
