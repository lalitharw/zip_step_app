import { updateActivityStatusToPause, updateActivityStatusToResume } from "@/database/activities"
import { storePauseAt, storeResumeAt } from "@/database/activityPause"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { getCurrentActivityId } from "@/utils/activity"
import { getCurrentPauseActivityId, setPauseActivityId } from "@/utils/activityPause"
import { getCachedUser } from "@/utils/userStorage"

export const storePauseActivity = async () => {
    const user = await getCachedUser()
    try {

        const activityId = await getCurrentActivityId()
        if (!activityId) {
            throw new Error("Activity ID not found")
        }
        const res = await storePauseAt({
            activityId: activityId,
            userId: user.id
        })
        await setPauseActivityId(res)
        await updateActivityStatusToPause(activityId)
        useActivityPauseStore.getState().setIsActivityPaused(true)
        return true
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

export const storeResumeActivity = async () => {
    try {
        const pauseActivityId = await getCurrentPauseActivityId()
        const activityId = await getCurrentActivityId()
        if (!pauseActivityId) {
            throw new Error("Pause Activity ID not found")
        }

        if (!activityId) {
            throw new Error("Activity ID not found")
        }
        await storeResumeAt(pauseActivityId)
        await updateActivityStatusToResume(activityId)
        useActivityPauseStore.getState().setIsActivityPaused(false)
        return true
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}
