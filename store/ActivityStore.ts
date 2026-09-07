import { create } from "zustand"


type ActivityState = {
    activityId: number | null
    setActivityId: (value: number | null) => void
}

export const useActivityStore = create<ActivityState>((set) => ({
    activityId: null,
    setActivityId: (value) => {
        set(({
            activityId: value
        }))
    }
}))