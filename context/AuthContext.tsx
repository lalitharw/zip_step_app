import api from "@/utils/api";
import logger from "@/utils/logging/logger";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    provider: string
}

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    googleLogin: () => Promise<User>
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>,
    updateProfile: (name: string) => Promise<void>
}


const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {

        GoogleSignin.configure({
            webClientId: "182139057357-ibsvq19486ovbegnkj2no8l45u9dg3jc.apps.googleusercontent.com"
        })


        getUserData()
    }, [])


    async function googleLogin(): Promise<User> {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            })
            await GoogleSignin.signOut()
            const signInResult = await GoogleSignin.signIn()

            const idToken = signInResult.data?.idToken

            if (!idToken) {
                throw new Error("Google did not return an ID token")
            }
            const googleCredentials =
                GoogleAuthProvider.credential(idToken)

            const userCredentials = await signInWithCredential(
                getAuth(),
                googleCredentials
            )

            const firebaseIdToken =
                await userCredentials.user.getIdToken()

            const { data } = await api.post("/auth/login/google", {
                id_token: firebaseIdToken,
            })

            await SecureStore.setItemAsync(
                "auth_token",
                data.data.token
            )

            setUser(data.data.user)
            return data.data.user

        } catch (error) {
            logger.error(
                "Google Auth",
                "Something went wrong",
                error
            )

            throw error
        }
    }


    async function login(email: string, password: string) {
        try {
            const { data } = await api.post("/auth/login", { email, password })
            await SecureStore.setItemAsync("auth_token", data.data.token)
            setUser(data.data.user)
        }
        catch (error) {
            throw error
        }
    }

    async function register(email: string, password: string, name: string) {
        const { data } = await api.post("/auth/register", {
            email, password, password_confirmation: password, name
        })
        await SecureStore.setItemAsync("auth_token", data.data.token)
        setUser(data.data.user)
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

    async function updateProfile(name: string) {
        const { data } = await api.post("/users", {
            name
        })

        if (data && data.data.user) {
            setUser(data.data.user)
        }

    }

    async function getUserData() {
        try {
            const token = await SecureStore.getItemAsync("auth_token")
            if (!token) {
                setLoading(false)
                return
            }
            const { data } = await api.get("/users")
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
        <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateProfile, googleLogin }}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("AuthProvider Not Found")
    return context

}