import { useActivityStore } from "@/store/ActivityStore"
import { MapRef } from "@maplibre/maplibre-react-native"
import React from "react"

export const mapSnapShot = async (mapRef: React.RefObject<MapRef>) => {
    const imagePath = await mapRef.current.createStaticMapImage({
        output: "file"

    })
    useActivityStore.getState().setMapPath(imagePath)

}