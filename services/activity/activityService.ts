import {
    completeActivity,
    createActivity,
    getActivity,
    updateActivityStats,
    updateImagePath,
} from "@/database/activities"

import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useActivityStore } from "@/store/ActivityStore"
import { useLocationStore } from "@/store/locationStore"

import {
    deleteCurrentActivityId,
    getCurrentActivityId,
    setCurrentActivityId,
} from "@/utils/activity"

import { deleteCurrentPauseActivityId } from "@/utils/activityPause"

import { ensureBatteryOptimizationIgnored } from "@/utils/battery/batteryOptimization"

import {
    getCurrentLocation,
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    stopWatchingLocation,
} from "../locationService"

import {
    stopAccelerometer,
    subscribeAccelerometer,
} from "@/utils/sensors/accelerometer"

import { motionDectector } from "@/utils/sensors/motionDetector"


export const startActivity = async () => {
    try {
        // Clear previous route
        useLocationStore.getState().clearRoute()

        // Request location permission
        const permissionGranted = await requestLocationPermission()

        if (!permissionGranted) {
            throw new Error("Location permission was not granted")
        }

        // Ensure background tracking is allowed
        await ensureBatteryOptimizationIgnored()

        // Create activity in database
        const activity = await createActivity()

        if (!activity) {
            throw new Error("Failed to create activity")
        }

        // Save current activity ID
        await setCurrentActivityId(activity)

        useActivityStore
            .getState()
            .setActivityId(activity)

        // Start GPS tracking
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

        // Reset motion detector for new activity
        motionDectector.reset()

        // Start accelerometer
        subscribeAccelerometer()

        // Mark activity as recording
        useLocationStore
            .getState()
            .setIsRecording(true)

        return activity

    } catch (error) {
        // Make sure the sensor is not left running
        stopAccelerometer()

        // Reset motion detector
        motionDectector.reset()

        console.error("Start Activity Error: ", error)

        throw error
    }
}


export const stopActivity = async () => {
    try {
        // Get current activity ID
        const activityId = await getCurrentActivityId()

        if (!activityId) {
            throw new Error("Activity Id not found")
        }

        // Stop accelerometer
        stopAccelerometer()

        // Reset motion detector
        motionDectector.reset()

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

            useLocationStore
                .getState()
                .setShowResumeModal(true)

            useActivityPauseStore
                .getState()
                .setIsActivityPaused(false)

        } else if (activity.status === "paused") {

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