import * as SecureStore from "expo-secure-store"

const ACTIVITY_KEY = "cached_activity"

export async function saveCachedActivity(activity){
    await SecureStore.setItemAsync(ACTIVITY_KEY,JSON.stringify(activity))
}

export async function getCachedActivity(){
    const activity = await SecureStore.getItemAsync(ACTIVITY_KEY)
    return activity ? JSON.parse(activity) : null
}

export async function clearCachedActivity(){
    await SecureStore.deleteItemAsync(ACTIVITY_KEY)
}