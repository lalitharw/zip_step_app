import { colors } from "@/constants/theme";
import { Camera, Map } from "@maplibre/maplibre-react-native";
import { Text, View } from "tamagui";
import { Link, useRouter } from "expo-router";
import { Pressable } from "react-native";


type activityCard = {
    text: string | number
}

export default function ActivityCard({ text }: activityCard) {
    const router = useRouter()
    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";
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
            <Pressable onPress={() => router.push(`/(tabs)/history/${text}`)}>
            <View height={120}>
                <Map style={{ flex: 1, overflow: "hidden" }}
                    mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`}
                    logo={false}
                    attribution={false}
                    compass={false}
                >
                    <Camera
                        initialViewState={{
                            center: [

                                72.8777,

                                19.0760,
                            ],

                        }}
                    />
                </Map>
            </View>
            <View padding={10} >
                <Text
                    color={colors.secondaryWhite}
                    fontSize={13}
                >
                    Sep 11 • 7:32 PM
                </Text>
                <View
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
                </View>

                <View
                    flexDirection="row"
                    justifyContent="space-between"
                    marginTop={15}
                >
                    <View>
                        <Text color={colors.secondaryWhite}>
                            Avg Pace
                        </Text>

                        <Text
                            color={colors.primaryWhite}
                            fontSize={18}
                            fontWeight="600"
                        >
                            9:55 /km
                        </Text>
                    </View>

                    <View>
                        <Text color={colors.secondaryWhite}>
                            Avg Speed
                        </Text>

                        <Text
                            color={colors.primaryWhite}
                            fontSize={18}
                            fontWeight="600"
                        >
                            6.1 km/h
                        </Text>
                    </View>
                </View>
            </View>
            </Pressable>
            
        </View >
    )
}