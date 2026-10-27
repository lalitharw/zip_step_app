import { checkIfActivityIsRunning } from "@/services/activity/activityService"
import { useEffect } from "react"

export const useCheckIfActivityRunning = () => {
    useEffect(() => {
        const checkIfActivityIsRunningAndPaused = async () => {
            await checkIfActivityIsRunning()
        }

        checkIfActivityIsRunningAndPaused()
    },[])
}