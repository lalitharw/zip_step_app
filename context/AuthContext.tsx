import api from "@/utils/api";
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


type User = {
    id: number;
    name: string;
    email: string;
}

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        getUserData()
    }, [])


    async function login(email: string, password: string) {
        const { data } = await api.post("/auth/login", { email, password })
        await SecureStore.setItemAsync("auth_token", data.token)
        setUser(data.user)
    }

    async function register(email: string, password: string) {
        const { data } = await api.post("/auth/register", {
            email, password, password_confirmation: password
        })
        await SecureStore.setItemAsync("auth_token", data.token)
        setUser(data.user)
    }

    async function logout() {
        try {
            await api.post("/auth/logout")
        }
        catch { }
        finally {
            await SecureStore.deleteItemAsync("auth_token")
            setUser(null);
        }
    }

    async function getUserData() {
        try {
            const token = await SecureStore.getItemAsync("auth_token")
            if (!token) {
                setLoading(false)
                return
            }
            const { data } = await api.get("/user")
            setUser(data)
        }
        catch (err) {
            await SecureStore.deleteItemAsync("auth_token")
            setUser(null)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}


export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("AuthProvider Not Found")
    return context

}