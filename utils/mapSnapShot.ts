import { useActivityStore } from "@/store/ActivityStore"
import { useLocationStore } from "@/store/locationStore"
import { Camera, MapView } from "@rnmapbox/maps"
import { RefObject, } from "react"
import { saveMapSnapShotLocally } from "./saveMapSnapShotLocally"

type MapRef = RefObject<MapView | null>
type CameraRef = RefObject<Camera | null>

export const mapSnapShot = async (mapRef: MapRef, cameraRef: CameraRef) => {
    const routePoints = useLocationStore.getState().routeCoordinates
    if (!mapRef.current || !cameraRef.current || !routePoints.length )  return

    try {
        const longitudes = routePoints.map(point => point.longitude)
        const latitudes = routePoints.map(point => point.latitude)
        const minLongitude = Math.min(...longitudes)
        const maxLatitude = Math.max(...latitudes)
        const maxLongitude = Math.max(...longitudes)
        const minLatitude = Math.min(...latitudes)

        cameraRef.current?.fitBounds(
            [maxLongitude, maxLatitude],
            [minLongitude, minLatitude],
            [48, 48, 48, 48],
            500
        )
        await new Promise(resolve => setTimeout(resolve, 800))
        const imagePath = await mapRef.current.takeSnap(true)
        
        if(imagePath){
            await saveMapSnapShotLocally(imagePath)
        }
    }
    catch (error) {
        console.error("Failed to capture image snapshot: ", error)
    }
}