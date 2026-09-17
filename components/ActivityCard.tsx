import { colors } from "@/constants/theme";
import { metersToKilometers } from "@/utils/dataConversion";
import { formatTime } from "@/utils/formatTime";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Image, Text, View } from "tamagui";


type activityCard = {
    id: number,
    map_image_path: string,
    started_at: string,
    distance: number | null,
    duration: number | null
}

export default function ActivityCard({ id, map_image_path, started_at,distance, duration }: activityCard) {
    const router = useRouter()
    return (
        <View marginBottom={20}
            backgroundColor={colors.primaryBlack}
            borderRadius={8}
            borderColor={colors.primaryWhite}
            borderWidth={1}
            shadowRadius={12}
            shadowOpacity={0.25}
            overflow="hidden"
        >
            <Pressable onPress={() => router.push(`/(tabs)/history/${id}`)}>
                <View height={120}>
                    <Image height={"100%"} width={"100%"} src={`${map_image_path}`} />
                </View>
                <View padding={10} marginTop={10} >
                    <Text
                        color={colors.secondaryWhite}
                        fontSize={13}
                    >
                        {/* Sep 11 • 7:32 PM */}
                        {new Date(started_at).toDateString()}
                    </Text>
                    {/* <View
                        flexDirection="row"
                        justifyContent="space-between"
                    >
                        <View>
                            <Text color={colors.secondaryWhite}>
                                Distance
                            </Text>
                            <Text
                                color={colors.primaryWhite}
                                fontSize={18}
                                fontWeight="600"
                            >
                                2.45 km
                            </Text>
                        </View>
                        <View>
                            <Text color={colors.secondaryWhite}>
                                Duration
                            </Text>
                            <Text
                                color={colors.primaryWhite}
                                fontSize={18}
                                fontWeight="600"
                            >
                                24:18
                            </Text>
                        </View>
                    </View> */}

                    <View
                        flexDirection="row"
                        justifyContent="space-between"
                        marginTop={10}
                    >
                        <View>
                            <Text color={colors.secondaryWhite}>
                                Distance
                            </Text>

                            <Text
                                color={colors.primaryWhite}
                                fontSize={18}
                                fontWeight="600"
                            >
                                {metersToKilometers(distance ?? 0)} km
                            </Text>
                        </View>

                        <View>
                            <Text color={colors.secondaryWhite}>
                                Duration
                            </Text>

                            <Text
                                color={colors.primaryWhite}
                                fontSize={18}
                                fontWeight="600"
                            >
                                {formatTime(duration ?? 0)} km/h
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>

        </View >
    )
}