"use client";
// This is a must
import { ThemeProvider } from "./theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
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
