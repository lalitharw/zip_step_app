import { useTheme } from "@/context/ThemeContext";
import { metersToKilometers } from "@/utils/dataConversion";
import { milliSecondsToMinutes } from "@/utils/formatTimeUtills";
import { LinearGradient } from "@tamagui/linear-gradient";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Image, Text, View } from "tamagui";
import StatBlock from "../StatsBlock";
import SeparatorVertical from "../separators/SeparatorVertical";


type activityCard = {
    id: number,
    map_image_path: string,
    started_at: string,
    distance: number | null,
    duration: number | null
}

export default function Card({ id, map_image_path, started_at, distance, duration }: activityCard) {
    const router = useRouter()
    const { theme } = useTheme()

    return (
        <Pressable onPress={() => router.push(`/${id}`)}>
            <View
                marginBottom={16}
                backgroundColor={theme.tileBg}
                borderRadius={16}
                borderColor={theme.tileBorder}
                borderWidth={1}
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 4 }}
                shadowRadius={12}
                shadowOpacity={0.3}
                overflow="hidden"
            >
                <View height={140}>
                    <Image
                        height="100%"
                        width="100%"
                        src={map_image_path}
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.6)"]}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                        }}
                    />
                    <View
                        position="absolute"
                        bottom={10}
                        left={12}
                    >
                        <Text color={theme.text} fontSize={13} fontWeight="600">
                            {new Date(started_at ?? 0).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                            })}
                        </Text>
                        <Text color={theme.text} fontSize={11}>
                            {new Date(started_at ?? 0).toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit", hour12: true,
                            })}
                        </Text>
                    </View>
                </View>

                <View
                    flexDirection="row"
                    paddingVertical={16}
                    paddingHorizontal={16}
                >
                    <StatBlock
                        label="Duration"
                        value={duration ? milliSecondsToMinutes(duration) : "--"}
                        unit="min"
                    />
                    <SeparatorVertical />
                    <StatBlock
                        label="Distance"
                        value={distance ? metersToKilometers(distance) : "--"}
                        unit="km"
                    />
                </View>
            </View>
        </Pressable>
    )
}

