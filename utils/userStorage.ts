import * as SecureStore from "expo-secure-store";

const USER_KEY = 'cached_user';

export async function saveCachedUser(user: {
    id: number,
    email: string,
    name: string,
    provider: string
}) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
}


export async function getCachedUser(){
    const user = await SecureStore.getItemAsync(USER_KEY)
    return user ? JSON.parse(user):null 
}

export async function clearCachedUser(){
    await SecureStore.deleteItemAsync(USER_KEY)
}