import api from "@/utils/api"

export const forgotPasswordAuth = async (email: string) => {
    const response = await api.post("auth/forgot-password", {
        email: email
    })
    
    return response.data
}


export const resetPasswordAuth = async({email,token,password,confirmPassword}: {email:string, token:string,password: string,confirmPassword: string}) => {
    const response = await api.post("auth/reset-password",{
        email,token,
        password,confirmPassword
    })
    return response.data
}

export const setPasswordAuth = async(password:string) => {
    const response = await api.post("users/set-password",{password})
    return response.data
}