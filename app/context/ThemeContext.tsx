"use client";

import { createContext, useState } from "react";

type ThemeContextType = {
    theme: "light" | "dark";
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ( {children}: {children: React.ReactNode} ) => {
    const [theme, setTheme] = useState<"light" | "dark">('light');

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`theme ${theme}`}>
            {children}
        </div>
        </ThemeContext.Provider>
    );
};
