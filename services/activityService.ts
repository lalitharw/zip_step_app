import { useLocationStore } from "@/store/locationStore"
import { startActivity, stopActivity } from "./api/LocationApi"
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "./locationService"



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
