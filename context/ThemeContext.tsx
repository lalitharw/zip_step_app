import React, { createContext, ReactNode, useContext, useState } from "react";
import { darkTheme,lightTheme } from "@/constants/colors";

type Theme = typeof lightTheme

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({children}: {children:ReactNode}){
    const [isDark,setIsDark] = useState<boolean>(true)

    const toggleTheme = () => {
        setIsDark((previous) => !previous)
    }

    const theme =  isDark ? darkTheme : lightTheme


    return (
        <ThemeContext.Provider value={{theme, isDark, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )

}


export function useTheme(){
    const context = useContext(ThemeContext)
    if(!context) throw new Error("Theme Provider Not found")
    return context
}