import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useLocationStore } from "@/store/locationStore"
import { coordinateDistance } from "./coordinateDistance"


// Note: Every Output is meters per seconds later will be format it

export async function calculateActivityDistance() {
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

export async function calculateActivityAverageSpeed() {
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


export async function calculateAveragePace() {
    try {
        const distance = useActivityStatsStore.getState().stats.distance
        const duration = useActivityStatsStore.getState().stats.duration
        if (distance <= 0 || duration <= 0) return
        const durationSeconds = duration / 1000
        const paceSecondsPerKm = (durationSeconds / distance) * 1000
        useActivityStatsStore.getState().setStats({
            averagePace: paceSecondsPerKm
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
            const currentTotal = useActivityStatsStore.getState().stats.elevationGain
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



