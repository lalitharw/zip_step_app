import { createActivityOnServer } from "@/api/activityApi"
import { uploadLocationPoint } from "@/api/locationPointApi"
import { getActivitiesWithUnSyncedPoints, getUnsyncedActivities, markActivityAsSynced, updateActivityServerId } from "@/database/activities"
import { getUnsyncedLocationPoints, markLocationPointsAsSynced } from "@/database/locationPoints"

let isSyncing = false

export const syncActivities = async () => {
    if (isSyncing) {
        return
    }

    isSyncing = true

    try {

        console.log("Syncing...")
        const activities = await getUnsyncedActivities()
        if (activities && activities?.length > 0) {
            for (const activity of activities) {
                const result = await createActivityOnServer(activity)
                if (result && result.id) {
                    console.log("API Result: ", result)
                    //update the local db activity with server_id
                    await updateActivityServerId(result.client_id, result.id)

                    // mark the activity as synced
                    await markActivityAsSynced(result.client_id)
                }

            }
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
    finally {
        isSyncing = false
    }

}


export const syncLocationPoints = async () => {
    if (isSyncing) {
        return
    }

    isSyncing = true
    try {
        const activities = await getActivitiesWithUnSyncedPoints()

        if (activities && activities.length > 0) {
            for (const activity of activities) {
                if (!activity.server_id) {
                    continue
                }
                const points = await getUnsyncedLocationPoints(activity.id)
                if (points.length == 0) {
                    continue
                }
                await uploadLocationPoint(points, activity.server_id)
                // console.log("ID: ", points.map((point) => point.id).join(","))
                await markLocationPointsAsSynced(Number(points.map((point) => point.id).join(",")))

            }
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
    finally {
        isSyncing = false
    }
}


export const syncData = async () => {
    await syncActivities()
    await syncLocationPoints()
}


