import { useActivityStore } from "@/store/ActivityStore"
import logger from "./logging/logger"
import * as FileSystem from "expo-file-system/legacy"

export const saveMapSnapShotLocally = async(imagePath:string) => {
    try{
       const directory = `${FileSystem.documentDirectory}/map-snapshots/`

       await FileSystem.makeDirectoryAsync(directory,{
        intermediates: true
       })


       const destination = `${directory}activity-${Date.now()}.png`

       await FileSystem.copyAsync({
        from: imagePath,
        to: destination
       })

       useActivityStore.getState().setMapPath(destination)
       logger.info("Map DEstionation","",destination)
       return destination
        
    }
    catch(error){
        logger.error("Failed to save map snapshot","",error)
        throw error
    }
}