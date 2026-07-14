import * as SecureStorage from "expo-secure-store"
import axios from "axios"

const api = axios.create({
    baseURL: "https://api.example.com"
})

api.interceptors.request.use(async(config) => {
    const token = await SecureStorage.getItemAsync("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})