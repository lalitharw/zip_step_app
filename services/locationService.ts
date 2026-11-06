import { useLocationStore } from "@/store/locationStore"
import { LOCATION_TASK_NAME } from "@/tasks/locationTasks"
import * as Location from "expo-location"


let locationSubscription: Location.LocationSubscription | null = null

export async function requestLocationPermission() {
    const foreground = await Location.requestForegroundPermissionsAsync()
    if (foreground.status !== "granted") {
        throw new Error("Foreground location permission denied")
    }
    return "granted"
}

export async function requestForegroundLocationPermission() {
    let permission = await Location.getForegroundPermissionsAsync();

    if (!permission.granted && permission.canAskAgain) {
        permission = await Location.requestForegroundPermissionsAsync();
    }

    if (!permission.granted) {
        return {
            status: permission.canAskAgain
                ? "denied"
                : "permanently_denied",
        };
    }

    const gpsEnabled = await Location.hasServicesEnabledAsync();

    if (!gpsEnabled) {
        return { status: "gps_disabled" };
    }

    return { status: "granted" };
}

// export async function requestBackgroundLocationPermission() {
//     const foreground = await Location.getForegroundPermissionsAsync()

//     if (!foreground.granted) {
//         throw new Error("Foreground location permission is required first")
//     }

//     const current = await Location.getBackgroundPermissionsAsync()

//     if (current.granted) {
//         return true
//     }

//     const background = await Location.requestBackgroundPermissionsAsync()

//     if (!background.granted) {
//         throw new Error("Background location permission denied. Enable it in Settings to track runs in the background")
//     }

//     return true
// }

export async function getCurrentLocation() {
    if (locationSubscription) return "granted"

    const permission = await Location.getForegroundPermissionsAsync()
    if (permission.status !== "granted") {
        const requested = await Location.requestForegroundPermissionsAsync()
        if (requested.status !== "granted") {
            return "denied"
        }
    }

    const gpsEnabled = await Location.hasServicesEnabledAsync();
    if (!gpsEnabled) return "gps_disabled"

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


    return "granted"
}


// export async function startWatchingLocation() {
//     if (locationSubscription) return true

//     const permission = await Location.getForegroundPermissionsAsync()
//     if (!permission.granted && permission.canAskAgain) {
//         const request = await Location.requestForegroundPermissionsAsync()
//         if (!request.granted) {
//             return false
//         }
//     }

//     const 

//     locationSubscription = await Location.watchPositionAsync({
//         accuracy: Location.Accuracy.BestForNavigation,
//         timeInterval: 1000,
//         distanceInterval: 1
//     },
//         (location) => {
//             useLocationStore.getState().setCurrentLocation({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//                 accuracy: location.coords.accuracy,
//                 speed: location.coords.speed,
//                 heading: location.coords.heading
//             })
//         }
//     )
// }


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
            distanceInterval: 1,
            activityType: Location.ActivityType.Fitness,
            pausesUpdatesAutomatically: false,
            foregroundService: {
                notificationTitle: "Zipstep is recording",
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