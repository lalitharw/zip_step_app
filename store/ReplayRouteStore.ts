import { create } from "zustand"

type ReplayRoute = [
    longitude: number,
    latitude: number,
    heading: number
]

type Points = {
    longitude: number
    latitude: number
    accuracy: number
    altitude: number
    speed: number
    heading: number,
    raw_latitude: number,
    raw_longitude: number
}

type ReplayRouteState = {
    isReplaying: boolean
    setIsReplaying: (value: boolean) => void

    replayRoute: ReplayRoute[]
    addReplayRoute: (route: ReplayRoute) => void
    clearReplayRoute: () => void

    locationPoints: Points[]
    setLocationPoints: (coordinate: Points[]) => void
}

export const useReplayRouteStore = create<ReplayRouteState>((set) => ({
    isReplaying: false,

    setIsReplaying: (value) =>
        set({
            isReplaying: value,
        }),

    replayRoute: [],

    addReplayRoute: (route) =>
        set((state) => ({
            replayRoute: [
                ...state.replayRoute,
                route,
            ],
        })),

    clearReplayRoute: () =>
        set({
            replayRoute: [],
        }),

    locationPoints: [],

    setLocationPoints: (points) =>
        set({
            locationPoints: points,
        }),
}))