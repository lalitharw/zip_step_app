import { create } from "zustand"

type ActivityPauseState = {
    isActivityPaused: boolean
    setIsActivityPaused: (value: boolean) => void
}

export const useActivityPauseStore = create<ActivityPauseState>((set) => ({
    isActivityPaused: false,
    setIsActivityPaused: (value: boolean) => {
        set(({
            isActivityPaused: value
        })
        )
    }
}))