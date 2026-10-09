import * as SecureStore from "expo-secure-store"

const ACTIVITY_PAUSE_KEY = "cached_activity_pause_key"

export async function saveCachedActivityPauseStore(activityPause){
    await SecureStore.setItemAsync(ACTIVITY_PAUSE_KEY,activityPause)
}

export async function getCachedActivityPause(){
    const activity_pause = await SecureStore.getItemAsync(ACTIVITY_PAUSE_KEY)
    return activity_pause ? JSON.parse(activity_pause) : null
}

export async function clearCachedActivityPause(){
    await SecureStore.deleteItemAsync(ACTIVITY_PAUSE_KEY)
}