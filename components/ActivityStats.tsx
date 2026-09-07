import { colors } from "@/constants/theme";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { metersToKilometers } from "@/utils/dataConversion";
import { formatTime } from "@/utils/formatTime";
import { View, XStack } from "tamagui";
import Stats from "./StatsComponent";

export default function ActivityStats() {
    const stats = useActivityStatsStore(
        state => state.stats
    )
    return (
        <View
            backgroundColor="$black"
            zIndex={300}
            padding={10}
            position="absolute"
            top={0}
            width="100%"
        >
            <XStack
                backgroundColor={colors.primaryBlack}
                borderRadius={20}
                borderColor={colors.primaryWhite}
                borderWidth={1}
                shadowRadius={12}
                shadowOpacity={0.25}
                elevation={8}
                justifyContent="space-around"
                alignItems="center"
                width="100%"
                height={"100%"}
            >
                <Stats label="Distance" value={`${metersToKilometers(stats.distance)} km`} />
                <View
                    width={1}
                    height={"65%"}
                    backgroundColor={colors.secondaryWhite}
                />
                <Stats label="Time" value={formatTime(stats.duration)} fontSize={25} />
                <View
                    width={1}
                    height={"65%"}
                    backgroundColor={colors.secondaryWhite}
                />
                <Stats label="Pace" value={`${metersToKilometers(stats.averagePace)}/km`} />
            </XStack>
        </View>

    )
}