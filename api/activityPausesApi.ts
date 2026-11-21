import { activityPause } from "@/database/activityPause";
import api from "@/utils/api";



export const createActivityPauses = async (data: any, activityId: string | number): Promise<activityPause | null> => {
    try {
        const response = await api.post("activity-pauses", {
            activity_id: activityId,
            pauses: data
        })
        return response.data
    }
    catch (error) {
        console.log("Something went wrong: ", error)
        throw error
    }
}