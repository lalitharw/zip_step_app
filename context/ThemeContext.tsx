import { darkTheme, lightTheme } from "@/constants/colors";
import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
type Theme = typeof lightTheme

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState<boolean>(true)
    const [isThemeLoaded,setIsThemeLoaded] = useState<boolean>(false)


    useEffect(() => {
        const loadTheme = async () => {
            try{
                const savedTheme = await SecureStore.getItemAsync("theme")
                setIsDark(savedTheme === "dark")
            }
            catch(error){
                console.error("Failed to load theme: ",error)
            }
            finally{
                setIsThemeLoaded(true)
            }
        }

        loadTheme()
    },[])

    useEffect(() => {
        if(!isThemeLoaded) return 

        SecureStore.setItemAsync("theme",isDark ? "dark" : "light").catch(error => {console.error("Failed to load theme: ",error)})

    },[isThemeLoaded,isDark])


    const toggleTheme = async () => {
       setIsDark((prev) => !prev)
    }

    const theme = isDark ? darkTheme : lightTheme


    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )

}


export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error("Theme Provider Not found")
    return context
}