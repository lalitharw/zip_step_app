import * as SecureStore from "expo-secure-store"


export const getCurrentPauseActivityId = async () => {
    const id = await SecureStore.getItemAsync("pause_activity_id")

    if (!id) {
        return false
    }

    return Number(id)
}


export const setPauseActivityId = async (pauseActivityId: number) => {
    await SecureStore.setItemAsync("pause_activity_id", String(pauseActivityId))
    return true
}


export const deleteCurrentPauseActivityId = async () => {
    await SecureStore.deleteItemAsync("pause_activity_id")
    return true
}