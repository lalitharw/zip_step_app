import { getCurrentLocation, stopWatchingLocation } from "@/services/locationService"
import { useEffect } from "react"

export const useCurrentLocation = () => {
        useEffect(() => {
            const startLocationWatcher = async() => {
                try{
                    const res = await getCurrentLocation()
                }
                catch(error){
                    console.error("Location Watching error: ",error)
                }
            }
            startLocationWatcher()
            return () => {
                stopWatchingLocation()
            }
        },[])
}