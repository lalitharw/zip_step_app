import { activityPause } from "@/database/activityPause";
import api from "@/utils/api";

export const createActivityPauses = async (data: activityPause): Promise<activityPause | null> => {
    try {
        const response = await api.post("activity-pauses", data)
        return response.data.data.activity_pauses
    }
    catch (error) {
        console.log("Something went wrong: ", error)
        throw error
    }
}