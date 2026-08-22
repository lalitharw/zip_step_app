import { getCurrentActivityId } from "@/utils/activity"
import { getLastLocationPoint, updateIsActiveNotificationSent } from "@/utils/database"
import { notifyActivityInactive } from "./notificationService"

export const checkActivityInactivity = async () => {
    try {

        const activityId = await getCurrentActivityId()
        const lastPoint = await getLastLocationPoint(activityId)

        if (!lastPoint) {
            return {
                "isInActive": false,
                "isNotificationSent": false
            }
        }

        const lastPointTime = new Date(lastPoint.timestamp).getTime()
        const caclulateTimeDifference = (Date.now() - lastPointTime) / 1000 / 60
        return {
            "isInActive": caclulateTimeDifference >= 15,
            "isNotificationSent": lastPoint.inactivity_notification_sent
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
        if (result.isInActive && !result.isNotificationSent) {
            await notifyActivityInactive()
            await updateIsActiveNotificationSent({ value: true, activityId: activityId })
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
        await updateIsActiveNotificationSent({ value: value, activityId: activityId })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
    }
}