import { create } from "zustand"

type Coordinates = {
    id?: number | null,
    longitude: number,
    latitude: number,
    accuracy?: number | null,
    altitude?: number | null,
    speed?: number | null,
    heading?: number | null
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
    addRouteCoordinates: (coordinates: Coordinates[]) => void

    clearRoute: () => void

    setRouteCoordinate: (coordinates: Coordinates[]) => void
    deleteRouteCoordinate: () => void,

    isGpsOff: boolean
    setIsGpsOff: (value: boolean) => void

    showResumeModal: boolean
    setShowResumeModal: (value: boolean) => void

    compassHeading: number | null,
    setCompassHeading: (value: number | null) => void


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
    // addRouteCoordinate(coordinate) {
    //     set((state) => ({
    //         routeCoordinates: [
    //             ...state.routeCoordinates,
    //             coordinate
    //         ]
    //     }))
    // },

    addRouteCoordinate(coordinate) {
        set((state) => {
            const alreadyExists = state.routeCoordinates.some(
                (point) => point.id === coordinate.id
            )

            if (alreadyExists) {
                return state
            }

            return {
                routeCoordinates: [
                    ...state.routeCoordinates,
                    coordinate
                ]
            }
        })
    },

    addRouteCoordinates(coordinates) {
        set((state) => {
            const existingIds = new Set(
                state.routeCoordinates.map((p) => p.id)
            )

            const newCoordinates = coordinates.filter((c) => {
                if (existingIds.has(c.id)) {
                    return false
                }

                existingIds.add(c.id)
                return true
            })

            if (!newCoordinates.length) return state

            return {
                routeCoordinates: [
                    ...state.routeCoordinates,
                    ...newCoordinates
                ]
            }
        })
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
            routeCoordinates: []
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

    compassHeading: null,
    setCompassHeading(value) {
        set({
            compassHeading: value
        })
    }
}))