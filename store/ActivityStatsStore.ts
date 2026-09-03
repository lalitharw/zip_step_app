import { create } from "zustand";

export type ActivitySta = {
    distance: number,
    duration: number,
    currentSpeed: number,
    averageSpeed: number,
    averagePace: number,
    elevationGain: number,
    currentElevation: number,
    maxSpeed: number
}

const initialStats: ActivitySta = {
    distance: 0,
    duration: 0,
    currentSpeed: 0,
    averageSpeed: 0,
    averagePace: 0,
    elevationGain: 0,
    currentElevation: 0,
    maxSpeed: 0
}


type ActivityStatsState = {
    stats: ActivitySta,
    setStats: (stats: Partial<ActivitySta>) => void
    resetStats: () => void
}


export const useActivityStatsStore = create<ActivityStatsState>((set) => ({
    stats: initialStats,
    resetStats: () => {
        set({
            stats: initialStats
        })
    },
    setStats: (stats) => {
        set((state) => ({
            stats: {
                ...state.stats,
                ...stats
            }
        }))
    }
}))


