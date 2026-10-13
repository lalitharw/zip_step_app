
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { getCurrentActivityId } from "@/utils/activity";
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime";
import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

type ActivityTimerProps = {
    isRecording: boolean;
    isPaused: boolean;
};

export const useActivityTimer = ({
    isRecording,
    isPaused,
}: ActivityTimerProps) => {
    const { start, pause, reset, totalMilliseconds } = useStopwatch({
        autoStart: false,
        interval: 1000,
    });

    const [isRestored,setIsRestored] = useState<boolean>(false)


    useEffect(() => {

        if(!isRestored) return

        if (!isRecording) {
            pause();
            reset(undefined, false);
            return;
        }

        if (isPaused) {
            pause();
        } else {
            start();
        }
    }, [isRecording, isPaused]);

    useEffect(() => {
        if (!isRecording || !isRestored) return
        useActivityStatsStore.getState().setStats({
            duration: totalMilliseconds
        })
    }, [totalMilliseconds])


    useEffect(() => {
        const restoreTimer = async () => {
            const activityId = await getCurrentActivityId();

            if (activityId) {
                const elapsed = await getActivityElapsedTime(activityId);

                if (elapsed !== null) {
                    reset(new Date(Date.now() - elapsed), false);
                }
            }
        };

        setIsRestored(true)

        void restoreTimer();
    }, []);
};