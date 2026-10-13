import { createActivity } from "@/database/activities"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useActivityStore } from "@/store/ActivityStore"
import { useLocationStore } from "@/store/locationStore"
import { deleteCurrentActivityId, setCurrentActivityId } from "@/utils/activity"
import { deleteCurrentPauseActivityId } from "@/utils/activityPause"
import { ensureBatteryOptimizationIgnored } from "@/utils/battery/batteryOptimization"
import { mapSnapShot } from "@/utils/mapSnapShot"
import { saveMapSnapShot } from "@/utils/maps/saveMapSnapShot"
import { stopAccelerometer } from "@/utils/sensors/accelerometer"
import { motionDectector } from "@/utils/sensors/motionDetector"
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "../locationService"
import { stopActivity } from "./activityService"

export const resetActivity = async () => {
    await deleteCurrentActivityId()
    await deleteCurrentPauseActivityId()
    useActivityStore.getState().setActivityId(null)
    useLocationStore.getState().setIsRecording(false)
    useActivityPauseStore.getState().setIsActivityPaused(false)
    useActivityStore.getState().deleteMapPath()
    useLocationStore.getState().deleteRouteCoordinate()
}

export const finishActivity = async (mapRef: Parameters<typeof mapSnapShot>[0]) => {
    stopAccelerometer()
    motionDectector.reset()
    await stopLocationTracking()
    await mapSnapShot(mapRef)
    await saveMapSnapShot()
    await stopActivity()
    await resetActivity()
}

export const startActivity = async () => {
    useLocationStore.getState().clearRoute()
    const permissionGranted = await requestLocationPermission()
    if (!permissionGranted) {
        throw new Error("Location permission was not granted")
    }
    await ensureBatteryOptimizationIgnored()
    const activity = await createActivity()
    if (!activity) {
        throw new Error("Failed to create activity")
    }
    await setCurrentActivityId(activity)
    useActivityStore.getState().setActivityId(activity)
    const trackingStarted = await startLocationTracking()
    if (!trackingStarted) {
        throw new Error("Location Tracking did not start")
    }

    useLocationStore.getState().setIsRecording(true)
    return activity

}