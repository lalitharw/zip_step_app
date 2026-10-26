import { useLocationStore } from "@/store/locationStore"
import { LOCATION_TASK_NAME } from "@/tasks/locationTasks"
import logger from "@/utils/logging/logger"
import * as Location from "expo-location"


let locationSubscription: Location.LocationSubscription | null = null

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

    return true
}

export async function requestForegroundLocationPermission() {
    const gpsActivated = await Location.hasServicesEnabledAsync()
    if (!gpsActivated) {
        throw new Error("Please enable GPS to continue")
    }
    const current = await Location.requestForegroundPermissionsAsync()

    const permission = current.granted ? current : await Location.requestForegroundPermissionsAsync()

    if (!permission.granted) {
        throw new Error("Foreground Location Permission Denied")
    }

    return true
}

export async function requestBackgroundLocationPermission() {
    const foreground = await Location.getForegroundPermissionsAsync()

    if (!foreground.granted) {
        throw new Error("Foreground location permission is required first")
    }

    const current = await Location.getBackgroundPermissionsAsync()

    if (current.granted) {
        return true
    }

    const background = await Location.requestBackgroundPermissionsAsync()

    if (!background.granted) {
        throw new Error("Background location permission denied. Enable it in Settings to track runs in the background")
        // throw new Error(
        //     `Background location denied: ${background.status}. ` +
        //     `Can ask again: ${background.canAskAgain}`
        // );
    }

    return true
}

export async function getCurrentLocation() {
    if (locationSubscription) {
        return true
    }

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
    locationSubscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1
    },
        (location) => {
            useLocationStore.getState().setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                speed: location.coords.speed,
                heading: location.coords.heading
            })
        }
    )

    return true

}


export function stopWatchingLocation() {

    locationSubscription?.remove()
    locationSubscription = null
}

export async function startLocationTracking() {

    const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
    )

    if (alreadyRunning) {
        return true
    }

    await Location.startLocationUpdatesAsync(
        LOCATION_TASK_NAME,
        {

            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval:1,
            activityType: Location.ActivityType.Fitness,
            pausesUpdatesAutomatically: false,
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