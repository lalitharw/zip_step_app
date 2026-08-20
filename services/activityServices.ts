import { useLocationStore } from "@/store/locationStore"
import { startActivity, stopActivity } from "./api/LocationApi"
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "./location"

const setIsRecording = useLocationStore((state) => state.setIsRecording)
const clearRoute = useLocationStore((state) => state.clearRoute)
export const stopActivityService = async () => {


    try {
        await stopLocationTracking()
        const stoppedActivity = await stopActivity()
        if (stoppedActivity == null) {
            throw new Error("Failed to stop activity")
        }
        setIsRecording(false)
    }
    catch (error) {
        console.error("Stop activity service error: ", error)
        throw error
    }
}


export const startActivityService = async () => {
    try {
        await requestLocationPermission()
        clearRoute()
        const activityStarted = await startActivity()
        if (!activityStarted) {
            throw new Error("Failed to start activity")
        }

        const trackingStarted = await startLocationTracking()
        if (!trackingStarted) {
            throw new Error("Location Tracking did not start")
        }
        setIsRecording(true)

    }
    catch (error) {
        console.error("Start Activity service error: ", error)
        throw error
    }
}