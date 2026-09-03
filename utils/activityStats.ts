import { getLocationPoints } from "@/database/locationPoints"
import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useLocationStore } from "@/store/locationStore"
import { getCurrentActivityId } from "./activity"
import { coordinateDistance } from "./coordinateDistance"


// Note: Every Output is meters per seconds later will be format it

export async function calculateActivityDistance() {
    try {
        const activityId = await getCurrentActivityId()
        if (!activityId) {
            throw new Error("Activity ID not found")
        }
        const points = await getLocationPoints(activityId)
        let totalDistance = 0
        for (let i = 1; i < points.length; i++) {
            const previous = points[i - 1]
            const current = points[i]
            totalDistance += coordinateDistance({
                lat1: previous.latitude,
                lon1: previous.longitude,
                lat2: current.latitude,
                lon2: current.longitude,
            }
            )
        }
        return totalDistance
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

export async function calculateActivityAverageSpeed() {
    // average speed = total distance / total time
    try {
        const distance = useActivityStatsStore.getState().stats.distance
        const duration = useActivityStatsStore.getState().stats.duration
        if (distance <= 0 || duration <= 0) return
        useActivityStatsStore.getState().setStats({
            averageSpeed: distance / duration
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


export async function calculateAveragePace() {
    try {
        const distance = useActivityStatsStore.getState().stats.distance
        const duration = useActivityStatsStore.getState().stats.duration
        if (distance <= 0 || duration <= 0) return
        const averagePace = duration / (distance / 1000)
        useActivityStatsStore.getState().setStats({
            averagePace: averagePace
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

export async function calculateElevationGain() {
    try {
        const routeCoordinates = useLocationStore.getState().routeCoordinates
        if (routeCoordinates.length < 2) return
        const previousElevation = routeCoordinates[routeCoordinates.length - 2].altitude
        const currentElevation = routeCoordinates[routeCoordinates.length - 1].altitude
        if (previousElevation == null || currentElevation == null) {
            return
        }
        if (currentElevation > previousElevation) {
            const currentTotal = useActivityStatsStore.getState().stats.elevationGain ?? 0
            const gain = currentElevation - previousElevation
            useActivityStatsStore.getState().setStats({
                elevationGain: currentTotal + gain
            })
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

export async function calculateActivityMaxSpeed() {
    try {
        const routeCoordinates = useLocationStore.getState().routeCoordinates
        let latestPoint = routeCoordinates[routeCoordinates.length - 1]
        if (!latestPoint) return
        const maxSpeed = useActivityStatsStore.getState().stats.maxSpeed
        useActivityStatsStore.getState().setStats({
            maxSpeed: Math.max(maxSpeed, latestPoint.speed)
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}



