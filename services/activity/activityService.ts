import { completeActivity, createActivity, getActivity, updateActivityStats, updateImagePath } from "@/database/activities"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useActivityStore } from "@/store/ActivityStore"
import { useLocationStore } from "@/store/locationStore"
import { deleteCurrentActivityId, getCurrentActivityId, setCurrentActivityId, } from "@/utils/activity"
import { deleteCurrentPauseActivityId } from "@/utils/activityPause"
import { ensureBatteryOptimizationIgnored } from "@/utils/battery/batteryOptimization"
import { stopAccelerometer, subscribeAccelerometer, } from "@/utils/sensors/accelerometer"
import { stopBarometer } from "@/utils/sensors/barometer"
import { motionDectector } from "@/utils/sensors/motionDetector"
import { getCurrentLocation, requestLocationPermission, startLocationTracking, stopLocationTracking, stopWatchingLocation } from "../locationService"

export const startActivity = async (userId: number) => {

    try {
        useLocationStore.getState().clearRoute()

        const permissionGranted = await requestLocationPermission()

        if (!permissionGranted) {
            throw new Error("Location permission was not granted")
        }

        await ensureBatteryOptimizationIgnored()

        const activity = await createActivity(userId)


        if (!activity) {
            throw new Error("Failed to create activity")
        }

        await setCurrentActivityId(activity)

        useActivityStore
            .getState()
            .setActivityId(activity)

        const trackingStarted = await startLocationTracking()

        if (!trackingStarted) {
            await completeActivity(activity)

            await deleteCurrentActivityId()

            useActivityStore
                .getState()
                .setActivityId(null)

            throw new Error("Location Tracking did not start")
        }

        stopWatchingLocation()

        motionDectector.reset()

        subscribeAccelerometer()

        useLocationStore
            .getState()
            .setIsRecording(true)

        return activity

    } catch (error) {
        stopAccelerometer()
        motionDectector.reset()
        throw error
    }
}


export const stopActivity = async () => {
    try {

       
        const activityId = await getCurrentActivityId()


        if (!activityId) {
            throw new Error("Activity Id not found")
        }

        
        stopAccelerometer()

        // Reset motion detector
        motionDectector.reset()

        stopBarometer()


        // Stop GPS tracking
        await stopLocationTracking()

        // Save map snapshot/image path
        const imagePath = useActivityStore
            .getState()
            .imagePath

        if (imagePath) {
            await updateImagePath(
                activityId,
                imagePath
            )
        }

        // Save final activity statistics
        await storeActivityStats(activityId)

        // Complete activity
        const completed = await completeActivity(activityId)

        if (!completed) {
            throw new Error("Failed to complete Activity")
        }

        // Remove persisted activity IDs
        await deleteCurrentActivityId()
        await deleteCurrentPauseActivityId()

        // Clear activity store
        useActivityStore
            .getState()
            .setActivityId(null)

        // Stop recording state
        useLocationStore
            .getState()
            .setIsRecording(false)

        // Clear pause state
        useActivityPauseStore
            .getState()
            .setIsActivityPaused(false)

        // Clear map path
        useActivityStore
            .getState()
            .deleteMapPath()


        await getCurrentLocation()

        return true

    } catch (error) {
        console.error("Stop Activity Error: ", error)

        throw error
    }
}


const storeActivityStats = async (
    activityId: number
) => {
    const activityStats =
        useActivityStatsStore
            .getState()
            .stats

    await updateActivityStats(
        activityId,
        activityStats
    )
}


export const checkIfActivityIsRunning = async () => {
    try {
        const activityId = await getCurrentActivityId()


        if (!activityId) {
            return
        }

        const activity = await getActivity(activityId)

        if (!activity) {
            throw new Error("Activity not found")
        }

        if (activity.status === "running") {

            useLocationStore.getState().setIsRecording(true)

            useLocationStore
                .getState()
                .setShowResumeModal(true)


            useActivityPauseStore
                .getState()
                .setIsActivityPaused(false)

        } else if (activity.status === "paused") {
            useLocationStore.getState().setIsRecording(true)
            useActivityPauseStore
                .getState()
                .setIsActivityPaused(true)
        }

    } catch (error) {
        console.error(
            "Check Activity Error: ",
            error
        )

        throw error
    }
}