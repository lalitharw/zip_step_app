import { create } from "zustand"

type Coordinates = {
    longitude: number,
    latitude: number,
    accuracy? : number | null,
    altitude?: number | null,
    speed? : number | null,
    heading? : number | null
}


type LocationState = {
    currentLocation: Coordinates | null
    setCurrentLocation: (location: Coordinates) => void

    isRecording: boolean
    setIsRecording: (recording: boolean) => void

    showActivityPointModal: boolean,
    setShowActivityPointModal: (value: boolean) => void

    routeCoordinates: Coordinates[]
    addRouteCoordinate: (coordinate: Coordinates) => void

    clearRoute: () => void

    setRouteCoordinate: (coordinates: Coordinates[]) => void
    deleteRouteCoordinate: () => void,

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

    deleteRouteCoordinate() {
        set({
            routeCoordinates:[]
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
    },

    showActivityPointModal: false,
    setShowActivityPointModal(value) {
        set({
            showActivityPointModal: value
        })
    },
}))