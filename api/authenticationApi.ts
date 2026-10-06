import api from "@/utils/api"

export const forgotPasswordAuth = async (email: string) => {
    const response = await api.post("auth/forgot-password", {
        email: email
    })
    
    return response.data
}