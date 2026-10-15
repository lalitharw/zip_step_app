import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useActivityStore } from "@/store/ActivityStore"
import { getCurrentActivityId } from "@/utils/activity"
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime"
import logger from "@/utils/logging/logger"
import { useEffect, useState, useRef } from "react"
import { useStopwatch } from "react-timer-hook"

type activityTimerProps = {
    isRecording: boolean,
    isPaused: boolean
}

export const useActivityTimerNew = ({ isRecording, isPaused }: activityTimerProps) => {
    const [isRestored, setIsRestored] = useState<boolean>(false)
    const setStats = useActivityStatsStore((state) => state.setStats)
    const activityId = useActivityStore((state) => state.activityId)
    const { reset, start, pause, totalMilliseconds } = useStopwatch({autoStart:false})
    const timerElapsedRef = useRef(0)
    


    // calling on mount
    useEffect(() => {
        let cancelled = true
        const restore = async () => {
            try {
                cancelled = false
                const activityId = await getCurrentActivityId()
                console.log("Activity ID:l","",activityId)
                if (activityId !== null) {
                    const time = await getActivityElapsedTime(activityId)
                    if (time !== null) {
                        timerElapsedRef.current = time
                        setStats({
                            duration: time
                        })
                       
                    }
                }
            }
            finally {
                if(!cancelled){
                    setIsRestored(true)
                }
            }
        }

        restore()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (!isRestored) return
        if (isRecording && !isPaused) {
            start()
        }
        else {
            pause()
        }

    }, [isRecording, isPaused, isRestored])

    useEffect(() => {
        logger.info("Timmer","",timerElapsedRef.current)
        if (!isRestored) return

       setStats({
            duration: timerElapsedRef.current  + totalMilliseconds
        })

       
    }, [isRestored, totalMilliseconds])


   useEffect(() => {
        if(activityId === null && isRestored){
            timerElapsedRef.current = 0
            setStats({
                duration: 0
            })
            reset(undefined,false)
        }
   },[activityId])
}