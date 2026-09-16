import { create } from "zustand"


type ActivityState = {
    activityId: number | null,
    imagePath: string | null,
    setActivityId: (value: number | null) => void,
    setMapPath: (path: string) => void,
    deleteMapPath: () => void
}

export const useActivityStore = create<ActivityState>((set) => ({
    activityId: null,
    imagePath: null,
    setActivityId: (value) => {
        set(({
            activityId: value
        }))
    },
    setMapPath: (path) => {
        set({
            imagePath: path
        })
    },
    deleteMapPath: () => {
        set({
            imagePath: null
        })
    }
}))