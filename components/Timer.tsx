import { colors } from "@/constants/theme";
import { getCurrentActivityId } from "@/utils/activity";
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime";
import { useEffect, useState } from "react";
import { Text, View } from "tamagui";
import { formatTime } from "@/utils/formatTime";

export default function Timer() {
    const [elapsed, setElapsed] = useState<number>(0)
    const [activityId, setActivityId] = useState(0)

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