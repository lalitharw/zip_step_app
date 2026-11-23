import { LocationPoint } from "@/database/locationPoints"
import api from "@/utils/api"
import logger from "@/utils/logging/logger"



export const uploadLocationPoint = async (points: LocationPoint[], activityServerId: number) => {
    try {
        const response = await api.post("/activity-points", {
            activity_id: activityServerId,
            points: points.map((point) => ({
                id: point.id,
                latitude: point.latitude,
                longitude: point.longitude,
                client_id: point.client_id,
                accuracy: point.accuracy,
                altitude: point.altitude,
                speed: point.speed,
                raw_latitude: point.raw_latitude,
                raw_longitude: point.raw_longitude
            }))
        })

        return response.data
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}