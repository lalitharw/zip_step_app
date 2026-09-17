import Divider from "@/components/Divider";
import GradientBackground from "@/components/GradientBackground";
import ActivityCardDetailSkeleton from "@/components/skeleton_loading/ActivityCardDetailSkeleton";
import StatBlock from "@/components/StatsBlock";
import { colors } from "@/constants/theme";
import { Activity, getActivity } from "@/database/activities";
import { getLocationPoints, LocationPoint } from "@/database/locationPoints";
import { metersToKilometers } from "@/utils/dataConversion";
import { milliSecondsToMinutes } from "@/utils/formatTimeUtills";
import { Camera, GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "tamagui";



export default function ActivityDetail() {

    const { id } = useLocalSearchParams<{ id: string }>()
    const [activity, setActivity] = useState<Activity | null>(null)
    const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([])
    const [loading, setLoading] = useState<boolean>(false)



    useEffect(() => {
        if (!id) return
        const handleGetActivityData = async () => {
            setLoading(true)
            try {
                const activity = await getActivity(id)
                if (activity) {
                    setActivity(activity)
                    const locationPoints = await getLocationPoints(id)
                    setLocationPoints(locationPoints)
                }
            }
            catch (error) {
                console.error("DB Error: ", error)
            }
            finally {
                setLoading(false)
            }
        }

        handleGetActivityData()
    }, [id])


    const routeGeoJSON = {
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: locationPoints.map((point: { longitude: number, latitude: number }) => [
                point.longitude,
                point.latitude,
            ]),
        },
    };

    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";

    if (loading) {
        return (
            <GradientBackground>
                <ActivityCardDetailSkeleton />
            </GradientBackground>
        )
    }

    return (

        <GradientBackground>
            <View flex={1}>
                <View height={420} borderBottomLeftRadius={28} borderBottomRightRadius={28} overflow="hidden">
                    <Map
                        style={{ flex: 1 }}
                        mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`}
                        logo={false}
                        attribution={false}
                        compass={false}
                    >
                        {locationPoints.length > 0 && (
                            <>
                                <Camera center={[locationPoints[0].longitude, locationPoints[0].latitude]} zoom={18} />
                                <GeoJSONSource id="recorded-route" data={routeGeoJSON}>
                                    <Layer
                                        type="line"
                                        id="recorded-route-line"
                                        style={{ lineColor: "#1397c3", lineWidth: 5, lineCap: "round", lineJoin: "round" }}
                                    />
                                </GeoJSONSource>
                            </>
                        )}
                    </Map>
                </View>


                <ScrollView>
                    <View paddingHorizontal={20} paddingTop={24} paddingBottom={30} gap={20} marginTop={10}>

                        <View
                            backgroundColor="rgba(255,255,255,0.05)"
                            borderRadius={16}
                            borderWidth={1}
                            borderColor="rgba(255,255,255,0.08)"
                            padding={16}
                        >
                            <Text
                                color={colors.secondaryWhite}
                                fontSize={11}
                                fontWeight="600"
                                letterSpacing={1}
                                textTransform="uppercase"
                                marginBottom={12}
                            >
                                Activity Time
                            </Text>

                            <View flexDirection="row" alignItems="center">
                                <View flex={1} gap={4}>
                                    <Text color={colors.secondaryWhite} fontSize={12}>Started</Text>
                                    <Text color={colors.primaryWhite} fontSize={15} fontWeight="600">
                                        {new Date(activity?.started_at ?? 0).toLocaleDateString("en-IN", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </Text>
                                    <Text color={colors.secondaryWhite} fontSize={12}>
                                        {new Date(activity?.started_at ?? 0).toLocaleTimeString("en-IN", {
                                            hour: "2-digit", minute: "2-digit", hour12: true,
                                        })}
                                    </Text>
                                </View>

                                <View width={50} alignItems="center" justifyContent="center" gap={4}>
                                    <View width={7} height={7} borderRadius={4} backgroundColor="#1397c3" />
                                    <View width={1} height={28} backgroundColor="rgba(255,255,255,0.18)" />
                                    <View width={7} height={7} borderRadius={4} backgroundColor="rgba(255,255,255,0.5)" />
                                </View>

                                <View flex={1} alignItems="flex-end" gap={4}>
                                    <Text color={colors.secondaryWhite} fontSize={12}>Stopped</Text>
                                    <Text color={colors.primaryWhite} fontSize={15} fontWeight="600" textAlign="right">
                                        {new Date(activity?.stopped_at ?? 0).toLocaleDateString("en-IN", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </Text>
                                    <Text color={colors.secondaryWhite} fontSize={12}>
                                        {new Date(activity?.stopped_at ?? 0).toLocaleTimeString("en-IN", {
                                            hour: "2-digit", minute: "2-digit", hour12: true,
                                        })}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            backgroundColor="rgba(19,151,195,0.08)"
                            borderRadius={16}
                            borderWidth={1}
                            borderColor="rgba(19,151,195,0.2)"
                            padding={18}
                            flexDirection="row"
                        >
                            <StatBlock
                                label="Distance"
                                value={metersToKilometers(activity?.distance ?? 0)}
                                unit="km"
                                align="flex-start"
                                emphasize
                            />
                            <Divider />
                            <StatBlock
                                label="Duration"
                                value={activity?.duration ? milliSecondsToMinutes(activity.duration) : "--"}
                                unit="min"
                                align="center"
                            />
                            <Divider />
                            <StatBlock
                                label="Avg Speed"
                                value={activity?.average_speed?.toFixed(1) ?? "--"}
                                unit="km/h"
                                align="flex-end"
                            />
                        </View>

                        <View
                            backgroundColor="rgba(255,255,255,0.04)"
                            borderRadius={16}
                            padding={18}
                            flexDirection="row"
                        >
                            <StatBlock
                                label="Max Speed"
                                value={((activity?.max_speed ?? 0) * 3.6).toFixed(2)}
                                unit="km/h"
                                align="flex-start"
                                compact
                            />
                            <Divider />
                            <StatBlock
                                label="Elev. Gained"
                                value={activity?.elevation_gain?.toFixed(0) ?? "--"}
                                unit="m"
                                align="center"
                                compact
                            />
                            <Divider />
                            <StatBlock
                                label="Avg Pace"
                                value={metersToKilometers(activity?.average_pace ?? 0)}
                                unit="/km"
                                align="flex-end"
                                compact
                            />
                        </View>
                    </View>
                </ScrollView>

            </View>
        </GradientBackground>




    )
}



