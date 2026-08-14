import { create } from "zustand"

type Coordinates = {
    longitude: number,
    latitude: number
}

type LocationState = {
    currentLocation: Coordinates | null
    setCurrentLocation: (location: Coordinates) => void

    isRecording: boolean
    setIsRecording: (recording: boolean) => void
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
    }
}))