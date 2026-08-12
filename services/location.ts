import { LOCATION_TASK_NAME } from "@/tasks/locationTasks"
import * as Location from "expo-location"


export async function requestLocationPermission() {
    const foreground = await Location.requestForegroundPermissionsAsync()
    if (foreground.status !== "granted") {
        throw new Error("Foreground location permission denied")
    }

    const background = await Location.requestBackgroundPermissionsAsync()
    if (background.status !== "granted") {
        throw new Error("Background location Permission Denied")
    }
}

export async function getCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
    })

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    }
}

export async function startLocationTracking() {
    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
    )

    if (alreadyRunning) {
        return
    }

    await Location.startLocationUpdatesAsync(
        LOCATION_TASK_NAME,
        {

            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
            foregroundService: {
                notificationTitle: "StrideFlow is recording",
                notificationBody: "Your workout is being Recorded"
            },
            showsBackgroundLocationIndicator: true
        },
    )

    return true

}

export async function stopLocationTracking() {
    const isTracking = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
    )

    if (!isTracking) {
        return
    }

    await Location.stopLocationUpdatesAsync(
        LOCATION_TASK_NAME
    )

    return true
}