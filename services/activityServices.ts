import { useLocationStore } from "@/store/locationStore"
import { getLastLocationPoint, getLocationPoints, updateIsActiveNotificationSent } from "@/utils/database"
import * as SecureStore from "expo-secure-store"
import { startActivity, stopActivity } from "./api/LocationApi"
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "./location"
import { notifyActivityInactive } from "./notificationService"



export const stopActivityService = async () => {

    try {
        await stopLocationTracking()
        const stoppedActivity = await stopActivity()
        if (stoppedActivity == null) {
            throw new Error("Failed to stop activity")
        }
        useLocationStore.getState().setIsRecording(false)
    }
    catch (error) {
        console.error("Stop activity service error: ", error)
        throw error
    }
}


export const startActivityService = async () => {
    try {
        await requestLocationPermission()
        console.log(await getLocationPoints())
        useLocationStore.getState().clearRoute()
        const activityStarted = await startActivity()
        if (!activityStarted) {
            throw new Error("Failed to start activity")
        }

        const trackingStarted = await startLocationTracking()
        if (!trackingStarted) {
            throw new Error("Location Tracking did not start")
        }
        useLocationStore.getState().setIsRecording(true)

    }
    catch (error) {
        console.error("Start Activity service error: ", error)
        throw error
    }
}

export const checkActivityInactivityService = async () => {
    try {
        const activityId = await SecureStore.getItemAsync("activity_id")

        if (!activityId) {
            throw new Error("Activity ID not Found")
        }
        const lastPoint = await getLastLocationPoint(Number(activityId))

        if (!lastPoint) {
            return {
                "isInactive": false,
                "isNotificationSent": null
            }
        }
        const lastPointTime = new Date(lastPoint.timestamp).getTime()
        const minuteSinceLastTime = (Date.now() - lastPointTime) / 1000 / 60
        return {
            "isInactive": minuteSinceLastTime >= 15,
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
        const inActive = await checkActivityInactivityService()

        if (inActive.isInactive && !inActive.isNotificationSent) {
            await notifyActivityInactive()
            await updateIsActiveNotificationSent(true)
        }

        await updateIsActiveNotificationSent(false)
    }
    catch (error) {
        console.error("Inactivity notification check failed: ", error)
    }
}
