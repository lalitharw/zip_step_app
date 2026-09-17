import { completeActivity, createActivity, getActivity, updateActivityStats, updateImagePath } from "@/database/activities"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useActivityStore } from "@/store/ActivityStore"
import { useLocationStore } from "@/store/locationStore"
import { deleteCurrentActivityId, getCurrentActivityId, setCurrentActivityId } from "@/utils/activity"
import { deleteCurrentPauseActivityId } from "@/utils/activityPause"
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "./locationService"


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
        useActivityStore.getState().setActivityId(activity)
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
        const imagePath = useActivityStore.getState().imagePath
        if (imagePath) {
            await updateImagePath(activityId, imagePath)
        }
        await storeActivityStats(activityId)
        const completed = await completeActivity(activityId)
        if (!completed) {
            throw new Error("Failed to complete Activity")
        }
        await deleteCurrentActivityId()
        await deleteCurrentPauseActivityId()
        useActivityStore.getState().setActivityId(null)
        useLocationStore.getState().setIsRecording(false)
        useActivityPauseStore.getState().setIsActivityPaused(false)
        useActivityStore.getState().deleteMapPath()
        return true
    }
    catch (error) {
        console.error("Stop Activity Error: ", error)
        throw error
    }
}

const storeActivityStats = async (activityId: number) => {
    try {
        const activityStats = useActivityStatsStore.getState().stats
        await updateActivityStats(activityId, activityStats)
    }
    catch (error) {
        console.error("Something went wrong: ", error)
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
                useActivityPauseStore.getState().setIsActivityPaused(false)
            }
            else if (activity.status == "paused") {
                useActivityPauseStore.getState().setIsActivityPaused(true)
            }
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}