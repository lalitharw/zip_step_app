import { useLocationStore } from "@/store/locationStore"
import { LOCATION_TASK_NAME } from "@/tasks/locationTasks"
import * as Location from "expo-location"




export async function requestLocationPermission() {
    const gpsActivated = await Location.hasServicesEnabledAsync()
    if (!gpsActivated) {
        throw new Error("Please enabled GPS to continue")
    }
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
    const serviceEnabled = await Location.hasServicesEnabledAsync()
    if (!serviceEnabled) {
        throw new Error("Please enable GPS to continue")
    }

    const permission = await Location.getForegroundPermissionsAsync()
    if (permission.status !== "granted") {
        const requested = await Location.requestForegroundPermissionsAsync()
        if (requested.status !== "granted") {
            throw new Error("Location Permisson Denied")
        }
    }
    const location = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5
    },
        (location) => {
            useLocationStore.getState().setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        }
    )

    return true

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