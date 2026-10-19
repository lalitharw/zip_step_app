import { createActivity } from "@/database/activities";
import { useLocationStore } from "@/store/locationStore";
import { deleteCurrentActivityId, getCurrentActivityId, setCurrentActivityId } from "@/utils/activity";
import api from "@/utils/api";



export async function startActivity() {
    try {
        const response = await api.post("/activities")
        await setCurrentActivityId(response.data.data.activity.id)
        await createActivity()
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
    try {
        const activity_id = await getCurrentActivityId()
        if (!activity_id) {
            return false
        }

        const response = await api.get(`activities/check-if-active/${activity_id}`)
        if (response && response.data.data.activity) {
            if (response.data.data.activity.status === "active") {
                useLocationStore.getState().setShowResumeModal(true)
            }
        }
    }
    catch (error) {
        console.error(error?.response?.data?.message || error)
    }
}