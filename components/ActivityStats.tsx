import { colors } from "@/constants/theme";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { metersToKilometers } from "@/utils/dataConversion";
import { formatTime } from "@/utils/formatTime";
import { useState } from "react";
import { Button, Text, View, XStack, YStack } from "tamagui";
import Stats from "./StatsComponent";

export default function ActivityStats() {
    const stats = useActivityStatsStore(
        state => state.stats
    )

    const [expanded, setExpanded] = useState(false)
    return (
        <View
            backgroundColor="$black"
            zIndex={300}
            padding={10}
            position="absolute"
            top={0}
            width="100%"
        >

            <YStack backgroundColor={colors.primaryBlack}
                borderRadius={20}
                borderColor={colors.primaryWhite}
                borderWidth={1}
                shadowRadius={12}
                shadowOpacity={0.25}
                padding={10}
                elevation={8}
            >
                <XStack alignItems="center">
                    <Stats flex={1} label="Distance" value={`${metersToKilometers(stats.distance)} km`} />
                    <View
                        width={1}
                        height={"65%"}
                        backgroundColor={colors.secondaryWhite}
                    />
                    <Stats flex={1} fontSize={20} label="Time" value={formatTime(stats.duration)} />
                    <View
                        width={1}
                        height={"65%"}
                        backgroundColor={colors.secondaryWhite}
                    />
                    <Stats flex={1} label="Pace" value={`${metersToKilometers(stats.averagePace)}/km`} />

                </XStack>
                {


                    expanded && (
                        <>
                            <View
                                width={"100%"}
                                height={1}
                                backgroundColor={colors.secondaryWhite}
                            />
                            <XStack alignItems="center" justifyContent="flex-start">
                                <Stats flex={1} label="Avg Speed" value={`${metersToKilometers(stats.averageSpeed)} km/h`} />
                                <View
                                    width={1}
                                    height={"65%"}
                                    backgroundColor={colors.secondaryWhite}
                                />
                                <Stats flex={1} label="Max Speed" value={`${metersToKilometers(stats.maxSpeed)} km/h`} />
                                <View
                                    width={1}
                                    height={"65%"}
                                    backgroundColor={colors.secondaryWhite}
                                />
                                <Stats flex={1} label="Elevation" value={`${Math.round(stats.elevationGain)} m`} />

                            </XStack>
                            <View
                                width={"100%"}
                                height={1}
                                backgroundColor={colors.secondaryWhite}
                            />
                            <XStack alignItems="center" justifyContent="flex-start">
                                <Stats flex={1} label="Current Elevation" value={`${Math.round(stats.currentElevation)} m`} />
                                <View
                                    width={1}
                                    height={"65%"}
                                    backgroundColor={colors.secondaryWhite}
                                />
                                <Stats flex={1} label="Current Speed" value={`${(stats.currentSpeed * 3.6).toFixed(1)} km/h`} />

                            </XStack>
                        </>
                    )
                }

                <Button
                    unstyled
                    marginTop={10}
                    paddingVertical={6}
                    alignItems="center"
                    onPress={() => setExpanded(prev => !prev)}
                >
                    <Text
                        color={colors.secondaryWhite}
                        fontSize={13}
                        fontWeight="600"
                    >
                        {expanded ? "Show Less ︿" : "See More  ﹀"}
                    </Text>
                </Button>


            </YStack>

        </View>
    )
}