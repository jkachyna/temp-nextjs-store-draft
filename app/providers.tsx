"use client";
// This is a must
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster />
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </>
    );
}

export default Providers;
