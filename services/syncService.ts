import { createActivityOnServer, deleteActivity } from "@/api/activityApi"
import { createActivityPauses } from "@/api/activityPausesApi"
import { uploadLocationPoint } from "@/api/locationPointApi"
import { getActivitiesWithUnsyncedActivityPauses, getActivitiesWithUnSyncedPoints, getUnsyncedActivities, getUnSyncedDeletedActivities, hardDeleteActivity, markActivityAsSynced, updateActivityServerId } from "@/database/activities"
import { getUnSyncedActivityPause, markActivityPauseAsSynced } from "@/database/activityPause"
import { getUnsyncedLocationPoints, markLocationPointsAsSynced } from "@/database/locationPoints"

let isSyncing = false

export const syncActivities = async () => {
    try {

        const activities = await getUnsyncedActivities()

        if (activities && activities?.length > 0) {
            for (const activity of activities) {
                const result = await createActivityOnServer(activity)
                if (result && result.id) {
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

}


export const syncLocationPoints = async () => {
    try {
        const activities = await getActivitiesWithUnSyncedPoints()

        if (activities && activities.length > 0) {
            for (const activity of activities) {
                if (!activity.server_id) {
                    continue
                }
                const points = await getUnsyncedLocationPoints(activity.id)
                if (!points.length) {
                    continue
                }

                const batchSize = 20

                for (let i = 0; i < points.length; i += batchSize) {
                    const batchPoints = points.slice(i, i + batchSize)
                    await uploadLocationPoint(batchPoints, activity.server_id)
                    await markLocationPointsAsSynced(batchPoints.map((point) => point.id))
                }


            }
        }
    }
    catch (error: any) {
        console.log("STATUS:", error.response?.status)
        console.log("DATA:", error.response?.data)
        console.log("ERROR:", error.response?.data?.errors)
        throw error
    }
}

export const syncActivityPauses = async () => {
    try {
        const activityPauses = await getActivitiesWithUnsyncedActivityPauses()
        if (activityPauses && activityPauses.length > 0) {
            for (const activityPause of activityPauses) {
                if (!activityPause.server_id) {
                    continue
                }

                const activityPausePoints = await getUnSyncedActivityPause(activityPause.id)

                if (activityPausePoints.length == 0) {
                    continue
                }

                const res = await createActivityPauses(activityPausePoints, activityPause.server_id)

                if (res && res?.data?.success) {
                    await markActivityPauseAsSynced(activityPausePoints.map((point) => point.id))
                }


            }
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


export const syncDeletedActivities = async () => {
    try {
        const activities = await getUnSyncedDeletedActivities()
        if (activities && activities.length > 0) {
            for (const activity of activities) {
                if (!activity.server_id) {
                    continue
                }
                const result = await deleteActivity(activity.server_id)
                if (result.client_id) {
                    await hardDeleteActivity(result.client_id)
                }
            }
        }

    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


export const syncData = async () => {
    if (isSyncing) {
        return
    }
    try {
        isSyncing = true

        await syncActivities()
        await syncLocationPoints()
        await syncActivityPauses()
        await syncDeletedActivities()
    }
    catch (error) {

    }
    finally {
        isSyncing = false
    }

}





