import { create } from "zustand"

type Coordinates = {
    longitude: number,
    latitude: number,
    accuracy: number,
    altitude: number,
    speed: number
}


type LocationState = {
    currentLocation: Coordinates | null
    setCurrentLocation: (location: Coordinates) => void

    isRecording: boolean
    setIsRecording: (recording: boolean) => void

    routeCoordinates: Coordinates[]
    addRouteCoordinate: (coordinate: Coordinates) => void

    clearRoute: () => void

    setRouteCoordinate: (coordinates: Coordinates[]) => void

    isGpsOff: boolean
    setIsGpsOff: (value: boolean) => void

    showResumeModal: boolean
    setShowResumeModal: (value: boolean) => void
}

export const useLocationStore = create<LocationState>((set) => ({
    currentLocation: null,
    setCurrentLocation: (location) => set({
        currentLocation: location
    }),

    isRecording: false,
    setIsRecording: (recording) => {
        set({
            isRecording: recording
        })
    },

    routeCoordinates: [],
    addRouteCoordinate(coordinate) {
        set((state) => ({
            routeCoordinates: [
                ...state.routeCoordinates,
                coordinate
            ]
        }))
    },

    clearRoute: () => {
        set({
            routeCoordinates: []
        })
    },


    setRouteCoordinate(coordinates) {
        set({
            routeCoordinates: coordinates
        })
    },

    isGpsOff: false,
    setIsGpsOff(value) {
        set({
            isGpsOff: value
        })
    },

    showResumeModal: false,
    setShowResumeModal: (value) => {
        set({
            showResumeModal: value
        })
    }
}))