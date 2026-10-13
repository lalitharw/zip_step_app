import { updateImagePath } from "@/database/activities"
import { useActivityStore } from "@/store/ActivityStore"
import { getCurrentActivityId } from "../activity"

export const saveMapSnapShot = async () => {
    try{
        const activityId = await getCurrentActivityId()
        if(!activityId){
            throw new Error("Activity ID not found")
        }
        const imagePath = useActivityStore.getState().imagePath
        if(imagePath){
            await updateImagePath(activityId,imagePath)
        }
    }
    catch(error){
        throw error
    }
}