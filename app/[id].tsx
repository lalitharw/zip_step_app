import Metric from "@/components/activity_details/Metric";
import TimeStop from "@/components/activity_details/TimeStop";
import BackButton from "@/components/buttons/BackButton";
import DeleteButton from "@/components/buttons/DeleteButton";
import GradientBackground from "@/components/GradientBackground";
import DeleteModal from "@/components/modals/DeleteModal";
import ActivityCardDetailSkeleton from "@/components/skeleton_loading/ActivityCardDetailSkeleton";
import ReplayRouteButton from "@/components/ui/ReplayRouteUI";
import { useTheme } from "@/context/ThemeContext";
import { Activity, getActivity } from "@/database/activities";
import { getLocationPoints } from "@/database/locationPoints";
import { useReplayRouteStore } from "@/store/ReplayRouteStore";
import { metersToKilometers } from "@/utils/dataConversion";
import { milliSecondsToMinutes } from "@/utils/formatTimeUtills";
import { formatDate, formatPace } from "@/utils/formatUnits";
import Mapbox, { Camera, LineLayer, MapView, ShapeSource } from "@rnmapbox/maps";
import Navigation from "@rnmapbox/navigation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View, XStack } from "tamagui";


export default function ActivityDetail() {
    const { theme } = useTheme()

    // mapbox configuration
    Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)
    Navigation.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)

    const { id } = useLocalSearchParams<{ id: string }>()
    const cameraRef = useRef<Camera>(null)
    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)


    const isReplaying = useReplayRouteStore((state) => state.isReplaying)
    const replayCoordinates = useReplayRouteStore((state) => state.replayRoute)
    const setLocationPoints = useReplayRouteStore((state) => state.setLocationPoints)
    const locationPoints = useReplayRouteStore((state) => state.locationPoints)


    useEffect(() => {
        if (!id) return
        const handleGetActivityData = async () => {
            setLoading(true)
            try {
                const activity = await getActivity(id)
                if (activity) {
                    console.log(activity)
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



    const routeGeoJSON = useMemo(() => ({
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: locationPoints.map((point) => [
                point.longitude,
                point.latitude
            ])
        },
    }), [locationPoints])


    const routeBounds = useMemo(() => {
        if (!locationPoints.length) return

        const longitudes = locationPoints.map((p) => p.longitude)
        const latitudes = locationPoints.map((p) => p.latitude)


        return {
            northeast: [
                Math.max(...longitudes),
                Math.max(...latitudes)
            ] as [number, number],
            southwest: [
                Math.min(...longitudes),
                Math.min(...latitudes)
            ] as [number, number]
        }

    }, [locationPoints])


    useEffect(() => {
        if (!locationPoints.length || !isMapLoaded || !routeBounds) return

        cameraRef.current?.fitBounds(
            routeBounds.northeast,
            routeBounds?.southwest,
            [45, 35, 45, 35],
            1000
        )
    }, [isMapLoaded, routeBounds, locationPoints.length])


    useEffect(() => {
        if (isReplaying || !locationPoints.length) return

        const longitudes = locationPoints.map((p) => p.longitude)
        const latitudes = locationPoints.map((p) => p.latitude)

        cameraRef.current?.fitBounds(
            [
                Math.max(...longitudes),
                Math.max(...latitudes),
            ],
            [
                Math.min(...longitudes),
                Math.min(...latitudes),
            ],
            [60, 60, 60, 60],
            100
        );


    }, [isReplaying])






    const replayRouteGeoJSON = useMemo(() => (
        {
            type: "Feature" as const,
            properties: {},
            geometry: {
                type: "LineString" as const,
                coordinates: replayCoordinates
            },
        }
    ), [replayCoordinates])


    if (loading) {
        return (
            <GradientBackground>
                <ActivityCardDetailSkeleton />
            </GradientBackground>
        )
    }


    return (
        <GradientBackground>

            <View flex={1} backgroundColor={theme.background}>


                <View height={400} overflow="hidden">
                    <BackButton url={"/history"} top={50} />
                    {/* <DeleteButton top={50} onPressDelete={() => { setOpenDeleteModal(true); }} /> */}


                    <MapView onDidFinishLoadingMap={() => setIsMapLoaded(true)} style={{ flex: 1 }} scaleBarEnabled={false} styleURL={Mapbox.StyleURL.Outdoors}>
                        {
                            !isReplaying && locationPoints.length >= 2 && (
                                <>
                                    <Camera
                                        ref={cameraRef}
                                        defaultSettings={{
                                            centerCoordinate: locationPoints.length
                                                ? [
                                                    locationPoints[0].longitude,
                                                    locationPoints[0].latitude,
                                                ]
                                                : [72.973068, 19.2242275],

                                        }}
                                        minZoomLevel={3}
                                        maxZoomLevel={18}
                                    />
                                    <ShapeSource id="rawroutesource" shape={routeGeoJSON}>
                                        <LineLayer id="raw-route-line" style={{
                                            lineColor: theme.plot,
                                            lineWidth: 8,
                                            lineCap: 'round',
                                            lineJoin: 'round',
                                        }} />
                                    </ShapeSource>
                                </>
                            )
                        }

                        {
                            isReplaying && replayCoordinates.length >= 2 && (
                                <>
                                    <Camera
                                        ref={cameraRef}
                                    // zoomLevel={17}


                                    />
                                    <ShapeSource id="replay-route-source" shape={replayRouteGeoJSON}>
                                        <LineLayer id="replay-route-line" style={{
                                            lineColor: theme.plot,
                                            lineWidth: 8,
                                            lineCap: 'round',
                                            lineJoin: 'round',
                                        }} />
                                    </ShapeSource>
                                </>
                            )
                        }

                    </MapView>


                    <View position="absolute" right={20} bottom={44}>
                        {
                            isMapLoaded && <ReplayRouteButton cameraRef={cameraRef} locationPoints={locationPoints} />

                        }
                    </View>
                </View>

                <ScrollView
                    style={{
                        marginTop: -28,
                        backgroundColor: theme.background,
                        borderTopLeftRadius: 32,
                        borderTopRightRadius: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View backgroundColor={theme.background} paddingHorizontal={20} paddingTop={12} paddingBottom={40} gap={14}>


                        <View alignSelf="center" width={40} height={4} borderRadius={2} backgroundColor={theme.pill} />


                        <View paddingTop={14} paddingBottom={6} gap={2}>
                            <XStack justifyContent="space-between" alignItems="center">
                                <Text color={theme.secondaryText} fontSize={14}>
                                    {formatDate(activity?.started_at)}
                                </Text>
                                <DeleteButton onPressDelete={() => { setOpenDeleteModal(true); }} />
                            </XStack>
                            <View flexDirection="row" alignItems="flex-end" gap={8}>
                                <Text
                                    color={theme.primary}
                                    fontSize={80}
                                    lineHeight={84}
                                    fontWeight="800"
                                    letterSpacing={-3}
                                >
                                    {metersToKilometers(activity?.distance ?? 0)}
                                </Text>
                                <Text color={theme.secondaryText} fontSize={24} fontWeight="700" marginBottom={12}>
                                    km
                                </Text>
                            </View>
                        </View>


                        <View flexDirection="row" gap={12}>
                            <Metric
                                label="Duration"
                                value={activity?.duration ? milliSecondsToMinutes(activity.duration) : "--"}
                                unit="min"
                            />
                            <Metric
                                label="Avg speed"
                                value={((activity?.average_speed ?? 0) * 3.6).toFixed(1)}
                                unit="km/h"
                            />
                        </View>

                        <View flexDirection="row" gap={12}>
                            <Metric
                                label="Max speed"
                                value={((activity?.max_speed ?? 0) * 3.6).toFixed(1)}
                                unit="km/h"
                            />
                            <Metric
                                label="Avg pace"
                                value={formatPace(activity?.average_pace ?? 0)}
                                unit="/km"
                            />
                        </View>

                        <View flexDirection="row" gap={12}>
                            <Metric
                                label="Elevation gained"
                                value={activity?.elevation_gain?.toFixed(0) ?? "--"}
                                unit="m"
                            />
                            <Metric
                                label="Elevation loss"
                                value={activity?.elevation_loss?.toFixed(0) ?? "--"}
                                unit="m"
                            />
                        </View>


                        <View
                            backgroundColor={theme.tileBg}
                            borderRadius={20}
                            borderWidth={1}
                            borderColor={theme.tileBorder}
                            padding={18}
                            marginTop={4}
                        >
                            <View flexDirection="row" alignItems="center">
                                <TimeStop label="Started" ms={activity?.started_at ?? "--"} align="flex-start" />

                                <View flex={1.2} flexDirection="row" alignItems="center" paddingHorizontal={8}>
                                    <View width={9} height={9} borderRadius={5} backgroundColor={theme.primary} />
                                    <View flex={1} height={2} backgroundColor={theme.primary} />
                                    <View width={9} height={9} borderRadius={5} borderWidth={2} borderColor={theme.primary} />
                                </View>

                                <TimeStop label="Stopped" ms={activity?.stopped_at ?? "--"} align="flex-end" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>


            {
                <DeleteModal activityId={id} visible={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />
            }


        </GradientBackground >
    );
}