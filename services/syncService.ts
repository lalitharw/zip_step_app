import { createActivityOnServer } from "@/api/activityApi"
import { getUnsyncedActivities, markActivityAsSynced, updateActivityServerId } from "@/database/activities"

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