import { useLocationStore } from "@/store/locationStore";
import api from "@/utils/api";
import * as SecureStore from "expo-secure-store";


const setShowResumeModal = useLocationStore((state) => state.setShowResumeModal)

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

export async function checkIfActivityIsActive() {
    try {
        const activity_id = await SecureStore.getItemAsync("activity_id")
        console.log("Activity ID: ", activity_id)
        if (!activity_id) {
            return false
        }

        const response = await api.get(`activities/check-if-active/${activity_id}`)
        if (response && response.data.data.activity) {
            if (response.data.data.activity.status === "active") {
                console.log("Do you want to resume activity")
                setShowResumeModal(true)
            }
        }
    }
    catch (error) {
        console.error(error.response.data.message || error)
    }
}