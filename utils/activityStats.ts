import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useLocationStore } from "@/store/locationStore"
import { coordinateDistance } from "./coordinateDistance"
import { ELEVATION_THRESHOLD } from "./gps/gpsConfig"
import logger from "./logging/logger"


// Note: Every Output is meters per seconds later will be format it

export function calculateActivityDistance() {
    try {
        const routeCoordinates = useLocationStore.getState().routeCoordinates
        if (routeCoordinates.length < 2) return
        const previousPoint = routeCoordinates[routeCoordinates.length - 2]
        const currentPoint = routeCoordinates[routeCoordinates.length - 1]
        const distance = coordinateDistance({
            lat1: previousPoint.latitude,
            lon1: previousPoint.longitude,
            lat2: currentPoint.latitude,
            lon2: currentPoint.longitude,
        })
        const currentDistance = useActivityStatsStore.getState().stats.distance
        useActivityStatsStore.getState().setStats({
            distance: currentDistance + distance
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


// export async function calculateActivityDuration() {
//     try {
//         let elapsed = 0
//         const activityId = await getCurrentActivityId()
//         if (!activityId) {
//             return 0
//         }
//         const activity = await getActivity(activityId)
//         if (!activity?.started_at) {
//             return 0
//         }
//         const startTime = new Date(activity.started_at).getTime()
//         const endTime = activity.stopped_at ? new Date(activity.stopped_at).getTime() : Date.now()
//         elapsed = endTime - startTime
//         const pauses = await getActivityPause(activityId)
//         for (const pause of pauses) {
//             const pauseTime = new Date(pause.pause_at).getTime()
//             const resumeTime = pause.resume_at ? new Date(pause.resume_at).getTime() : Date.now()
//             elapsed -= resumeTime - pauseTime
//         }
//         return Math.max(0, elapsed)
//     }
//     catch (error) {
//         console.error("Something went wrong: ", error)
//     }
// }

export function calculateAverageSpeed() {
    // average speed = total distance / total time
    try {
        const distance = useActivityStatsStore.getState().stats.distance
        const duration = useActivityStatsStore.getState().stats.duration
        if (distance <= 0 || duration <= 0) return
        const durationSeconds = duration / 1000
        useActivityStatsStore.getState().setStats({
            averageSpeed: distance / durationSeconds
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


export function calculateAveragePace() {
    try {
        const distance = useActivityStatsStore.getState().stats.distance
        const duration = useActivityStatsStore.getState().stats.duration
        if (distance <= 0 || duration <= 0) return
        const durationSeconds = duration / 1000
        const paceSecondsPerKm = (durationSeconds / distance)
        useActivityStatsStore.getState().setStats({
            averagePace: paceSecondsPerKm
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

export function calculateElevation() {
    const routeCoordinates = useLocationStore.getState().routeCoordinates

    if (routeCoordinates.length < 2) return

    let previousAltitude = routeCoordinates[routeCoordinates.length - 2].altitude
    let currentAltitude = routeCoordinates[routeCoordinates.length - 1].altitude
    if (currentAltitude == null || previousAltitude == null) return

    const difference = currentAltitude - previousAltitude
    logger.info("Difference","", difference)
    let elevationGain = useActivityStatsStore.getState().stats.elevationGain
    let elevationLoss = useActivityStatsStore.getState().stats.elevationLoss

    logger.info("Elevation Gain","",elevationGain)
    logger.info("Elevation Loss","",elevationLoss)

    if (difference >= ELEVATION_THRESHOLD) {
        elevationGain += difference
    }
    else if (difference <= -ELEVATION_THRESHOLD) {
        elevationLoss += Math.abs(difference)
    }

    useActivityStatsStore.getState().setStats({
        currentElevation: currentAltitude,
        elevationGain: elevationGain,
        elevationLoss: elevationLoss
    })
}


// export function calculateElevationGain() {
//     try {
//         const routeCoordinates = useLocationStore.getState().routeCoordinates
//         if (routeCoordinates.length < 2) return
//         const previousElevation = routeCoordinates[routeCoordinates.length - 2].altitude
//         const currentElevation = routeCoordinates[routeCoordinates.length - 1].altitude
//         if (previousElevation == null || currentElevation == null) {
//             return
//         }
//         if (currentElevation > previousElevation) {
//             const currentTotal = useActivityStatsStore.getState().stats.elevationGain
//             const gain = currentElevation - previousElevation
//             useActivityStatsStore.getState().setStats({
//                 elevationGain: currentTotal + gain,
//                 currentElevation: currentElevation
//             })
//         }
//     }
//     catch (error) {
//         console.error("Something went wrong: ", error)
//         throw error
//     }
// }

export function calculateActivityMaxSpeed() {
    try {
        const routeCoordinates = useLocationStore.getState().routeCoordinates
        let latestPoint = routeCoordinates[routeCoordinates.length - 1]
        if (!latestPoint) return
        const maxSpeed = useActivityStatsStore.getState().stats.maxSpeed
        useActivityStatsStore.getState().setStats({
            maxSpeed: Math.max(maxSpeed, latestPoint.speed),
            currentSpeed: latestPoint.speed
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}



