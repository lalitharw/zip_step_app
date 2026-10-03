import { useLocationStore } from "@/store/locationStore"
import { LOCATION_TASK_NAME } from "@/tasks/locationTasks"
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

export async function getCurrentLocation() {
    console.log("Watching current Location")
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
        distanceInterval: 3
    },
        (location) => {
            useLocationStore.getState().setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy
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
    
    console.log("Task Registered: ", await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME))
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
            distanceInterval: 2,
            activityType: Location.ActivityType.Fitness,
            pausesUpdatesAutomatically: false,
            foregroundService: {
                notificationTitle: "StrideFlow is recording",
                notificationBody: "Your workout is being Recorded"
            },
            showsBackgroundLocationIndicator: true
        },
    )

    console.log("Task Registered: ", await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME))

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