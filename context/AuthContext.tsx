import api from "@/utils/api";
import logger from "@/utils/logging/logger";
import { clearCachedUser, getCachedUser, saveCachedUser } from "@/utils/userStorage";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    provider: string;
    created_at: string
}

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    googleLogin: () => Promise<User>
    checkEmail: (email: string) => Promise<any>
    login: ({ email, password }: { email: string, password: string }) => Promise<any>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>,
    setName: (name: string) => Promise<any>
    setPassword: (password: string) => Promise<any>
    updateProfile: (name: string) => Promise<void>
}


const AuthContext = createContext<AuthContextType | null>(null);


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {

        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEBCLIENT_ID
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

            logger.info("Token","",firebaseIdToken)

            const { data } = await api.post("/auth/login/google", {
                id_token: firebaseIdToken,
            })

            await SecureStore.setItemAsync(
                "auth_token",
                data.data.token
            )

            setUser(data.data.user)
            await saveCachedUser(data.data.user)
            return data.data.user

        } catch (error) {
            logger.error("Google Login Error","",error.response.data.message)
            logger.error(
                "Google Auth",
                "Something went wrong",
                error.response.data.message
            )

            throw error.response.data.message
        }
    }


    async function login({ email, password }: { email: string, password: string }) {
        try {
            const { data } = await api.post("/auth/login", { email, password })
            await SecureStore.setItemAsync("auth_token", data.data.token)
            setUser(data.data.user)
            await saveCachedUser(data.data.user)
            return data
        }
        catch (error) {
            throw error
        }
    }

    async function setPassword(password: string) {
        try {
            const { data } = await api.post("/users/set-password", { password })
            return data
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
        await saveCachedUser(data.data.user)

    }

    async function logout() {
        try {
            await api.post("/auth/logout")
        }
        catch { }
        finally {
            await SecureStore.deleteItemAsync("auth_token")
            setUser(null);
            await clearCachedUser()
        }
    }

    async function updateProfile(name: string) {
        const { data } = await api.post("/users", {
            name
        })

        if (data && data.data.user) {
            setUser(data.data.user)
            await saveCachedUser(data.data.user)
        }

    }

    async function checkEmail(email: string) {
        try{
            const { data } = await api.post("/auth/check-email", {
                email
            })
            console.log(data)
            return data
        }
        catch(error){
            throw error
        }
    }

    async function getUserData() {
        try {
            const token = await SecureStore.getItemAsync("auth_token")
            if (!token) {
                setLoading(false)
                setUser(null)
                return
            }
            const cachedUser = await getCachedUser()
            if (cachedUser) {
                setUser(cachedUser)
            }
            try {
                const { data } = await api.get("/users")
                const freshUser = data.data.user
                setUser(freshUser)
                await saveCachedUser(freshUser)
            }
            catch (error) {
                logger.warn("AUTH", "Could not refresh user profile", error);
            }
        }
        catch (err) {
            throw err
        }
        finally {
            setLoading(false)
        }
    }

    async function setName(name: string) {
        const { data } = await api.post("/users/set-name", { name })
        const updatedUser = data.data.user
        setUser(updatedUser)
        await saveCachedUser(updatedUser)
        return data
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateProfile, googleLogin, setPassword, checkEmail, setName }}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("AuthProvider Not Found")
    return context

}