import { colors } from "@/constants/theme";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { getCurrentActivityId } from "@/utils/activity";
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime";
import { formatTime } from "@/utils/formatTime";
import { useEffect, useState } from "react";
import { Text, View } from "tamagui";

export default function Timer() {
    const setStats = useActivityStatsStore((state) => state.setStats)
    const getTime = useActivityStatsStore((state) => state.stats.duration)
    const [activityId, setActivityId] = useState(0)

    useEffect(() => {
        const updateTimer = async () => {
            const activityId = await getCurrentActivityId()
            if (!activityId) {
                return
            }
            setActivityId(activityId)
            const time = await getActivityElapsedTime(activityId)
            if (time) {
                setStats({
                    duration: time
                })
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
                {formatTime(getTime)}
            </Text>
        </View>
    )
}