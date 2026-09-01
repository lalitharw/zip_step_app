import { colors } from "@/constants/theme";
import { getCurrentActivityId } from "@/utils/activity";
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime";
import { useEffect, useState } from "react";
import { Text, View } from "tamagui";

export default function Timer() {
    const [elapsed, setElapsed] = useState<number>(0)
    const [activityId, setActivityId] = useState(0)

    function formatTime(milliseconds: number) {
        const totalSeconds = Math.floor(milliseconds / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }



    useEffect(() => {
        const updateTimer = async () => {
            const activityId = await getCurrentActivityId()
            if (!activityId) {
                return
            }
            setActivityId(activityId)
            const time = await getActivityElapsedTime(activityId)
            if (time){
                setElapsed(time)
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [activityId])
    return (

        <View paddingVertical={45} alignItems="center">
            <Text color={colors.primaryWhite} fontWeight={"bold"} fontSize={70}>
                {formatTime(elapsed)}
            </Text>
        </View>
    )
}