import { updateImagePath } from "@/database/activities"
import { useActivityStore } from "@/store/ActivityStore"

export const saveMapSnapShot = async () => {
    try{
        const activityId = useActivityStore.getState().activityId
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