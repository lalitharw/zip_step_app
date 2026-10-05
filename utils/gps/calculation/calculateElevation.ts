import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { motionDectector } from "@/utils/sensors/motionDetector";

export function calculateElevation(relativeAltitude: number | null) {
    try{
        if(relativeAltitude === null){
            return
        }

        if(!motionDectector.isMoving()){
            return
        }

        const stats = useActivityStatsStore.getState().stats

        if(stats.currentElevation === 0){
            useActivityStatsStore.getState().setStats({
                currentElevation: relativeAltitude
            })
            return
        }

        const difference = relativeAltitude - stats.currentElevation

        const THRESHOLD = 2

        if(difference >= THRESHOLD){
            useActivityStatsStore.getState().setStats({
                elevationGain: stats.elevationGain + difference,
                currentElevation: relativeAltitude
            })
        }
        else if(difference <= -THRESHOLD){
            useActivityStatsStore.getState().setStats({
                elevationLoss: stats.elevationLoss + Math.abs(difference),
                currentElevation: relativeAltitude
            })
        }
    }
    catch(error){
        console.error("Something went wrong: ",error)
        throw error
    }
}