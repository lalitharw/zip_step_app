import api from "@/utils/api";
import * as SecureStore from "expo-secure-store";

export async function startActivity() {
    try {
        const response = await api.post("/activities")
        await SecureStore.setItemAsync("activity_id", String(response.data.data.activity.id))
        return true
    }
    catch (error) {
        console.error(error.response.data.message || error)
    }
    return false
}

export async function stopActivity() {
    try {
        const activity_id = await SecureStore.getItemAsync("activity_id")
        if (!activity_id) {
            return false
        }
        const data = await api.patch(`activities/stop-activity/${activity_id}`)
        await SecureStore.deleteItemAsync("activity_id")
        return true
    }
    catch (error) {
        console.error(error.response.data.message || error)
    }
    return false
}