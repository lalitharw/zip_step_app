import { getActivity } from "@/database/activities"
import { getActivityPause } from "@/database/activityPause"

export const getActivityElapsedTime = async (activityId: number): Promise<number | null> => {
    const activity = await getActivity(activityId)

    if (!activity?.started_at) {
        return 0
    }

    const startTime = new Date(activity.started_at).getTime()
    const endTime = activity.stopped_at ? new Date(activity.stopped_at).getTime() : Date.now()

    let elapsed = endTime - startTime

    const pauses = await getActivityPause(activityId)

    for (const pause of pauses) {
        const pauseTime = new Date(pause.pause_at).getTime()
        const resumeTime = pause.resume_at ? new Date(pause.resume_at).getTime() : Date.now()

        elapsed -= resumeTime - pauseTime
    }

    return Math.max(0, elapsed)

}