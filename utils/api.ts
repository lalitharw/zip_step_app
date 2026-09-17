import axios from "axios"
import { router } from "expo-router"
import * as SecureStorage from "expo-secure-store"

const api = axios.create({
    baseURL: "http://192.168.0.103:8000/api/v1"
})

api.interceptors.request.use(async (config) => {
    const token = await SecureStorage.getItemAsync("auth_token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use((response) => response,
    async (error) => {
        if (error.response?.status == 401) {
            await SecureStorage.deleteItemAsync("auth_token")
            router.replace("/(auth)/login")
        }
        return Promise.reject(error)
    })

export default api
