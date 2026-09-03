import { getActivity } from "@/database/activities"
import { getActivityPause } from "@/database/activityPause"
import { getLocationPoints } from "@/database/locationPoints"
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


export async function calculateActivityDuration() {
    try {
        let elapsed = 0
        const activityId = await getCurrentActivityId()
        if (!activityId) {
            return 0
        }
        const activity = await getActivity(activityId)
        if (!activity?.started_at) {
            return 0
        }
        const startTime = new Date(activity.started_at).getTime()
        const endTime = activity.stopped_at ? new Date(activity.stopped_at).getTime() : Date.now()
        elapsed = endTime - startTime
        const pauses = await getActivityPause(activityId)
        for (const pause of pauses) {
            const pauseTime = new Date(pause.pause_at).getTime()
            const resumeTime = pause.resume_at ? new Date(pause.resume_at).getTime() : Date.now()
            elapsed -= resumeTime - pauseTime
        }
        return Math.max(0, elapsed)
    }
    catch (error) {
        console.error("Something went wrong: ", error)
    }
}

export async function calculateActivityAverageSpeed() {
    // average speed = total distance / total time
    try {
        const distance = await calculateActivityDistance()
        const duration = await calculateActivityDuration()

        if (!duration || duration === 0 || !distance || distance === 0) {
            return 0
        }

        return distance / duration
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


export async function calculateAveragePace() {
    try {
        const distance = await calculateActivityDistance()
        const duration = await calculateActivityDuration()
        if (!duration || duration === 0 || !distance || distance === 0) {
            return 0
        }
        return duration / (distance / 1000)
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

export async function calculateElevationGain() {
    try {
        const activityId = await getCurrentActivityId()

        if (!activityId) {
            throw new Error("Activity ID not found")
        }

        const points = await getLocationPoints(activityId)
        let totalElevationGained = 0
        if (points) {
            for (let i = 1; i < points.length; i++) {
                let currentElevation = points[i].altitude
                let previousElevation = points[i - 1].altitude

                if (currentElevation > previousElevation) {
                    totalElevationGained += (currentElevation - previousElevation)
                }
            }
        }


    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

// export async function calculateActivityMaxSpeed(){
//     try{
//         const activityId = await getCurrentActivityId()
//         if(!activityId){
//             throw new Error("Activity ID not found")
//         }
//         const points = await getLocationPoints(activityId)

//     }
//     catch(error){
//         console.error("Something went wrong: ",error)
//         throw error
//     }
// }



