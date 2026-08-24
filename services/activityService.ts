import { completeActivity, createActivity, getActivity, getAllActivity } from "@/database/activities"
import { getLocationPoints } from "@/database/locationPoints"
import { useLocationStore } from "@/store/locationStore"
import { deleteCurrentActivityId, getCurrentActivityId, setCurrentActivityId } from "@/utils/activity"
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "./locationService"



// export const stopActivityService = async () => {

//     try {
//         await stopLocationTracking()
//         const stoppedActivity = await stopActivity()
//         if (!stoppedActivity) {
//             throw new Error("Failed to stop activity")
//         }
//         useLocationStore.getState().setIsRecording(false)
//     }
//     catch (error) {
//         console.error("Stop activity service error: ", error)
//         throw error
//     }
// }


// export const startActivityService = async () => {
//     try {
//         await requestLocationPermission()
//         useLocationStore.getState().clearRoute()
//         const activityStarted = await startActivity()
//         if (!activityStarted) {
//             throw new Error("Failed to start activity")
//         }

//         const trackingStarted = await startLocationTracking()
//         if (!trackingStarted) {
//             throw new Error("Location Tracking did not start")
//         }
//         useLocationStore.getState().setIsRecording(true)

//     }
//     catch (error) {
//         console.error("Start Activity service error: ", error)
//         throw error
//     }
// }


export const startActivity = async () => {
    try {
        const permissionGranted = await requestLocationPermission()
        if (!permissionGranted) {
            throw new Error("Location permission was not granted")
        }
        useLocationStore.getState().clearRoute()
        const activity = await createActivity()
        if (!activity) {
            throw new Error("Failed to create activity")
        }

        await setCurrentActivityId(activity)
        const trackingStarted = await startLocationTracking()
        if (!trackingStarted) {
            await completeActivity(activity)
            throw new Error("Location Tracking did not start")
        }
        useLocationStore.getState().setIsRecording(true)
        return activity
    }
    catch (error) {
        console.error("Start Activity Error: ", error)
        throw error
    }
}


export const stopActivity = async () => {
    try {
        await stopLocationTracking()
        const activityId = await getCurrentActivityId()
        if (!activityId) {
            throw new Error("Activity Id not found")
        }
        console.log("Activity:", await getAllActivity())
        console.log("Location Points:", await getLocationPoints(activityId))
        const completed = await completeActivity(activityId)

        if (!completed) {
            throw new Error("Failed to complete Activity")
        }
        await deleteCurrentActivityId()
        useLocationStore.getState().setIsRecording(false)
        return true
    }
    catch (error) {
        console.error("Stop Activity Error: ", error)
        throw error
    }
}


export const checkIfActivityIsRunning = async () => {
    try {
        const activityId = await getCurrentActivityId()
        if (activityId) {
            const activity = await getActivity(activityId)
            if (!activity) {
                throw new Error("Activity not found")
            }
            if (activity.status === "running") {
                useLocationStore.getState().setShowResumeModal(true)
            }
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}