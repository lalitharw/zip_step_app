import { createActivityOnServer, deleteActivity } from "@/api/activityApi"
import { createActivityPauses } from "@/api/activityPausesApi"
import { uploadLocationPoint } from "@/api/locationPointApi"
import { pauses, ServerActivity } from "@/common/types/server"
import { getActivitiesWithUnsyncedActivityPauses, getActivitiesWithUnSyncedPoints, getUnsyncedActivities, getUnSyncedDeletedActivities, hardDeleteActivity, markActivityAsSynced, saveServerActivity, updateActivityServerId } from "@/database/activities"
import { getUnSyncedActivityPause, markActivityPauseAsSynced, saveServerActivityPause } from "@/database/activityPause"
import { getUnsyncedLocationPoints, markLocationPointsAsSynced } from "@/database/locationPoints"
import logger from "@/utils/logging/logger"
import { getServerActivities } from "./activityDownload"

let isSyncing = false

export const syncActivities = async () => {
    try {

        const activities = await getUnsyncedActivities()

        if (activities && activities?.length > 0) {
            for (const activity of activities) {
                const result = await createActivityOnServer(activity)
                if (result && result.id) {
                    await updateActivityServerId(result.client_id, result.id)
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

                const batchSize = process.env.EXPO_PUBLIC_BATCH_SIZE

                for (let i = 0; i < points.length; i += batchSize) {
                    const batchPoints = points.slice(i, i + batchSize)
                    await uploadLocationPoint(batchPoints, activity.server_id)
                    await markLocationPointsAsSynced(batchPoints.map((point) => point.id))
                }


            }
        }
    }
    catch (error: any) {
        console.error(error)
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

                await createActivityPauses(activityPausePoints, activityPause.server_id)
                await markActivityPauseAsSynced(activityPausePoints.map((point) => point.id))



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


export const downloadActivities = async () => {
    try {
        let page = 1;

        while (true) {
            const response = await getServerActivities()

            const activities: ServerActivity[] = response.data.activities.data

            for (const activity of activities) {
                const activity_id = await saveServerActivity(activity)
                await downloadActivityPauses(activity.pauses ?? [], activity_id)
            }

            if (!response.next_page_url) break;

            page++;
        }

    }
    catch (error) {
        console.error("Something went wrong: ", error)
    }
}

export const downloadActivityPauses = async (activityPauses: pauses[], activity_id: string | number) => {
    try {
        if (activityPauses && activityPauses.length > 0) {
            for (const activityPause of activityPauses) {

                await saveServerActivityPause(activityPause, activity_id)
            }
        }
    }
    catch (error) {
        console.error("Something went wrong: ", error)
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

export const syncFromServer = async () => {
    try {
        await downloadActivities()
    }
    catch (error) {
        console.error("Error Downloding data from server: ", error)
        throw error
    }
}





