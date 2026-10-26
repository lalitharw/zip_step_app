import logger from "@/utils/logging/logger"
import Mapbox from "@rnmapbox/maps"
import { useEffect, useRef } from "react"

type currentLocationProps = {
    latitude: number,
    longitude: number
}

export const useAnimateCamera = (currentLocation: currentLocationProps | null) => {
    const cameraRef = useRef<Mapbox.Camera>(null)

    useEffect(() => {
        if (!currentLocation) return;
        logger.info("Current Location","",currentLocation)
        cameraRef.current?.setCamera({
            centerCoordinate: [
                currentLocation.longitude,
                currentLocation.latitude,
            ],
            animationMode: 'easeTo',
            zoomLevel: 19,
            animationDuration: 1000,
        });
    }, [currentLocation]);

    return cameraRef
}