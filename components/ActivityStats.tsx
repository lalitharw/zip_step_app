import { colors } from "@/constants/theme";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { metersToKilometers } from "@/utils/dataConversion";
import { formatTime } from "@/utils/formatTimeUtills";
import { AnimatePresence, MotiView } from "moti";
import { useState } from "react";
import { Button, Text, View, XStack, YStack } from "tamagui";
import Divider from "./Divider";
import DividerVertical from "./DividerVertical";
import StatBlock from "./StatsBlock";

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
            top={30}
            width="100%"
        >
            <MotiView
                from={{
                    opacity: 0,
                    translateY: -10,
                }}
                animate={{
                    opacity: 1,
                    translateY: 0,
                }}
                exit={{
                    opacity: 0,
                    translateY: -10,
                }}
                transition={{
                    type: "timing",
                    duration: 250,
                }}>


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
                        <StatBlock
                            label="Distance"
                            value={`${metersToKilometers(stats.distance)}`}
                            unit="km"
                            align="center"
                            compact


                        />
                        <Divider />
                        <StatBlock
                            label="Time"
                            value={`${formatTime(stats.duration)}`}
                            unit=""
                            align="center"
                            compact
                            paddingVertical={15}

                        />
                        <Divider />
                        <StatBlock
                            label="Avg. Pace"
                            value={`${metersToKilometers(stats.averagePace)}`}
                            unit="km"
                            align="center"
                            compact
                            paddingVertical={15}

                        />
                    </XStack>
                    <AnimatePresence>
                        {
                            expanded && (
                                <MotiView
                                    from={{
                                        opacity: 0,
                                        translateY: -10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        translateY: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        translateY: -10,
                                    }}
                                    transition={{
                                        type: "timing",
                                        duration: 250,
                                    }}>
                                    <DividerVertical />
                                    <XStack alignItems="center" justifyContent="flex-start">
                                        <StatBlock
                                            label="Avg. Speed"
                                            value={`${(stats.averageSpeed * 3.6).toFixed(2)}`}
                                            unit="km/h"
                                            align="center"
                                            compact
                                            paddingVertical={15}
                                        />
                                        <Divider />
                                        <StatBlock
                                            label="Max Speed"
                                            value={`${(stats.maxSpeed * 3.6).toFixed(2)}`}
                                            unit="km/h"
                                            align="center"
                                            compact
                                            paddingVertical={15}
                                        />
                                        <Divider />
                                        <StatBlock
                                            label="Elev. Gain"
                                            value={`${Math.round(stats.elevationGain)} `}
                                            unit="m"
                                            align="center"
                                            compact
                                            paddingVertical={15}
                                        />

                                    </XStack>
                                    <DividerVertical />
                                    <XStack alignItems="center" justifyContent="flex-start">
                                        <StatBlock
                                            label="Elev. Gain"
                                            value={`${Math.round(stats.currentElevation)}`}
                                            unit="m"
                                            align="center"
                                            compact
                                            paddingVertical={15}
                                        />
                                        <Divider />
                                        <StatBlock
                                            label="Elev. Gain"
                                            value={`${(stats.currentSpeed * 3.6).toFixed(2)}`}
                                            unit="km/h"
                                            align="center"
                                            compact
                                            paddingVertical={15}
                                        />

                                    </XStack>
                                </MotiView>
                            )
                        }
                    </AnimatePresence>


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
            </MotiView>
        </View>

    )
}