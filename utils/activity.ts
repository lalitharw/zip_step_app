import * as SecureStore from "expo-secure-store"

export const getCurrentActivityId = async () => {
    const activityId = await SecureStore.getItemAsync("activity_id")

    if (!activityId) {
        return null
    }

    return Number(activityId)
}


export const setCurrentActivityId = async (activity_id: number) => {
    await SecureStore.setItemAsync("activity_id", String(activity_id))
    return true
}


export const deleteCurrentActivityId = async () => {
    await SecureStore.deleteItemAsync("activity_id")
    return true
}