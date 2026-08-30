import { storePauseAt, storeResumeAt } from "@/database/activityPause"
import { getCurrentActivityId } from "@/utils/activity"

export const storePauseActivity = async () => {
    try {
        const activityId = await getCurrentActivityId()
        if (!activityId)
            throw new Error("Activity ID not found")
        await storePauseAt(activityId)
        return true
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}

export const storeResumeActivity = async (id: number) => {
    try {
        await storeResumeAt(id)
        return true
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}