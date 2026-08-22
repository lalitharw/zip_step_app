import { useLocationStore } from "@/store/locationStore";
import { deleteCurrentActivityId, getCurrentActivityId, setCurrentActivityId } from "@/utils/activity";
import api from "@/utils/api";



export async function startActivity() {
    try {
        const response = await api.post("/activities")
        await setCurrentActivityId(response.data.data.activity.id)
        return true
    }
    catch (error) {
        console.error(error?.response?.data?.message || error)
    }
    return false
}

export async function stopActivity() {
    try {
        const activity_id = await getCurrentActivityId()
        if (!activity_id) {
            return false
        }
        const data = await api.patch(`activities/stop-activity/${activity_id}`)
        await deleteCurrentActivityId()
        return true
    }
    catch (error) {
        console.error(error?.response?.data?.message || error)
    }
    return false
}

export async function checkIfActivityIsActive() {
    console.log("Inside ")
    try {
        const activity_id = await getCurrentActivityId()
        console.log("Activity ID: ", activity_id)
        if (!activity_id) {
            return false
        }

        const response = await api.get(`activities/check-if-active/${activity_id}`)
        console.log("Response:", response)
        if (response && response.data.data.activity) {
            if (response.data.data.activity.status === "active") {
                console.log("Do you want to resume activity")
                useLocationStore.getState().setIsRecording(true)
            }
        }
    }
    catch (error) {
        console.error(error?.response?.data?.message || error)
    }
}