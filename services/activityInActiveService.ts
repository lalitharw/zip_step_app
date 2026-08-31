import { getActivity, updateInactivityNotificationStatus } from "@/database/activities"
import { getLastLocationPoint } from "@/database/locationPoints"
import { getCurrentActivityId } from "@/utils/activity"
import { notifyActivityInactive } from "./notificationService"

export const checkActivityInactivity = async () => {
    try {

        const activityId = await getCurrentActivityId()
        if (!activityId) {
            throw new Error("Activity Id not found")
        }
        const lastPoint = await getLastLocationPoint(activityId)

        if (!lastPoint) {
            return {
                "isInActive": false,
                "isNotificationSent": false
            }
        }

        const lastPointTime = new Date(lastPoint.timestamp).getTime()
        const caclulateTimeDifference = (Date.now() - lastPointTime) / 1000 / 60
        const activity = await getActivity(activityId)
        return {
            "isInActive": caclulateTimeDifference >= 15,
            "isNotificationSent": activity?.inactivity_notification_sent
        }
    }
    catch (error) {
        console.error("Something went wrong ", error)
        throw error
    }
}


export const checkAndNotifyActivityInactivity = async () => {
    try {
        const activityId = await getCurrentActivityId()
        const result = await checkActivityInactivity()
        if (result.isInActive && !result.isNotificationSent && activityId) {
            await notifyActivityInactive()
            await updateInactivityNotificationStatus(activityId, true)
        }
    }
    catch (error) {
        console.error("Inactivity notification check failed: ", error)
        throw error
    }
}

export const updateIsActiveNotificationSentStatus = async (value: boolean) => {
    try {
        const activityId = await getCurrentActivityId()
        if (activityId) {
            await updateInactivityNotificationStatus(activityId, value)
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
    }
}