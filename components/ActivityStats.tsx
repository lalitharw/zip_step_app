import { colors } from "@/constants/theme";
import { useActivityPauseStore } from "@/store/ActivityPauseStore";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { useLocationStore } from "@/store/locationStore";
import { metersToKilometers } from "@/utils/dataConversion";
import { formatTime } from "@/utils/formatTimeUtills";
import { formatPace } from "@/utils/formatUnits";
import { AnimatePresence, MotiView } from "moti";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";

const LIVE = "#FF4D4F"; 
const LINE = "rgba(255,255,255,0.14)";
const TABULAR = { fontVariant: ["tabular-nums" as const] };



const kmh = (ms: number) => (Number.isFinite(ms) ? (ms * 3.6).toFixed(1) : "--");
const meters = (v: number) => (Number.isFinite(v) ? String(Math.round(v)) : "--");

function LiveDot({ active }: { active: boolean }) {
    return (
        <View width={10} height={10} alignItems="center" justifyContent="center">
            {active && (
                <MotiView
                    from={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.4 }}
                    transition={{ type: "timing", duration: 300, loop:true }}
                    style={{
                        position: "absolute",
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: LIVE,
                    }}
                />
            )}
            <View
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor={active ? LIVE : colors.secondaryWhite}
            />
        </View>
    );
}

function Stat({
    label,
    value,
    unit,
}: {
    label: string;
    value: string;
    unit?: string;
}) {
    return (
        <YStack flex={1} gap={2}>
            <XStack alignItems="flex-end" gap={4}>
                <Text color={colors.primaryWhite} fontSize={22} fontWeight="700" style={TABULAR}>
                    {value}
                </Text>
                {!!unit && (
                    <Text color={colors.secondaryWhite} fontSize={12} marginBottom={3}>
                        {unit}
                    </Text>
                )}
            </XStack>
            <Text color={colors.secondaryWhite} fontSize={12}>
                {label}
            </Text>
        </YStack>
    );
}

const VLine = () => <View width={1} alignSelf="stretch" backgroundColor={LINE} />;
const HLine = () => (
    <View height={1} alignSelf="stretch" backgroundColor={LINE} marginVertical={12} />
);


export default function ActivityStats() {
    const isRecording = useLocationStore.getState().isRecording
    const isPaused = useActivityPauseStore.getState().isActivityPaused
    const stats = useActivityStatsStore((state) => state.stats);
    const [expanded, setExpanded] = useState(false);
    const insets = useSafeAreaInsets();

    return (
        
        <View
            position="absolute"
            top={insets.top + 8}
            left={12}
            right={12}
            zIndex={300}
            pointerEvents="box-none"
        >
            <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -10 }}
                transition={{ type: "timing", duration: 250 }}
            >
                <YStack
                    backgroundColor={colors.primaryBlack}
                    borderRadius={24}
                    borderColor={LINE}
                    borderWidth={1}
                    paddingHorizontal={16}
                    paddingTop={14}
                    paddingBottom={10}
                    shadowColor="#000"
                    shadowRadius={16}
                    shadowOpacity={0.35}
                    shadowOffset={{ width: 0, height: 6 }}
                    elevation={10}
                >
                  
                    <XStack alignItems="center" gap={8} marginBottom={6}>
                        <LiveDot active={(isRecording && !isPaused)} />
                        <Text color={colors.secondaryWhite} fontSize={13}>
                            {(isRecording && !isPaused) ? "Recording" : "Paused"}
                        </Text>
                    </XStack>

                    
                    <XStack alignItems="center" gap={16}>
                        <YStack flex={1.2}>
                            <XStack alignItems="flex-end" gap={6}>
                                <Text
                                    color={colors.primaryWhite}
                                    fontSize={48}
                                    lineHeight={52}
                                    fontWeight="800"
                                    letterSpacing={-1}
                                >
                                    {metersToKilometers(stats.distance)}
                                </Text>
                                <Text color={colors.secondaryWhite} fontSize={16} marginBottom={6}>
                                    km
                                </Text>
                            </XStack>
                            <Text color={colors.secondaryWhite} fontSize={12}>
                                Distance
                            </Text>
                        </YStack>

                        <VLine />

                        <YStack flex={1} gap={12}>
                            <Stat label="Time" value={formatTime(stats.duration)} />
                            <Stat
                                label="Avg. pace"
                                value={formatPace(stats.averagePace)}
                                unit="/km"
                            />
                        </YStack>
                    </XStack>

                   
                    <AnimatePresence>
                        {expanded && (
                            <MotiView
                                from={{ opacity: 0, translateY: -8 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                exit={{ opacity: 0, translateY: -8 }}
                                transition={{ type: "timing", duration: 220 }}
                            >
                                <HLine />
                                <XStack alignItems="center" gap={12}>
                                    <Stat label="Speed now" value={kmh(stats.currentSpeed)} unit="km/h" />
                                    <VLine />
                                    <Stat label="Avg. speed" value={kmh(stats.averageSpeed)} unit="km/h" />
                                    <VLine />
                                    <Stat label="Max speed" value={kmh(stats.maxSpeed)} unit="km/h" />
                                </XStack>

                                <HLine />
                                <XStack alignItems="center" gap={12}>
                                    <Stat label="Elevation" value={meters(stats.currentElevation)} unit="m" />
                                    <VLine />
                                    <Stat label="Elev. gain" value={meters(stats.elevationGain)} unit="m" />
                                    <VLine />
                                    <Stat label="Elev. loss" value={meters(stats.elevationLoss)} unit="m" />
                                    
                                </XStack>
                            </MotiView>
                        )}
                    </AnimatePresence>

                    
                    <YStack
                        onPress={() => setExpanded((v) => !v)}
                        pressStyle={{ opacity: 0.6 }}
                        alignItems="center"
                        marginTop={12}
                        gap={6}
                        paddingVertical={4}
                        accessibilityRole="button"
                        accessibilityLabel={expanded ? "Show fewer stats" : "Show more stats"}
                    >
                        <View width={36} height={4} borderRadius={2} backgroundColor={LINE} />
                        <Text color={colors.secondaryWhite} fontSize={12} fontWeight="600">
                            {expanded ? "Fewer stats" : "More stats"}
                        </Text>
                    </YStack>
                </YStack>
            </MotiView>
        </View>
    );
}