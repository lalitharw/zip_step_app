import { getCurrentLocation, stopWatchingLocation } from "@/services/locationService"
import { useEffect } from "react"

export const useCurrentLocation = () => {
    useEffect(() => {
        const startLocationWatcher = async () => {
            try {
                const res = await getCurrentLocation()

                if (!res) {
                    console.warn("Unable to start foreground location watcher")
                }
            }
            catch (error) {
                console.error("FOREGROUND LOCATION FAILED: ", error)
            }
        }
        startLocationWatcher()
        return () => {
            stopWatchingLocation()
        }
    }, [])
}