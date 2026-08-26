import { LocationPoint } from "@/database/locationPoints"
import api from "@/utils/api"



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
                speed: point.speed
            }))
        })
    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}