import { useActivityStore } from "@/store/ActivityStore"
import { MapRef } from "@maplibre/maplibre-react-native"

export const mapSnapShot = async (mapRef: React.RefObject<MapRef>) => {
    const imagePath = await mapRef.current.createStaticMapImage({
        output: "file"
    })
    console.log(imagePath)
    useActivityStore.getState().setMapPath(imagePath)

}