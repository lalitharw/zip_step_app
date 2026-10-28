import { useTheme } from "@/context/ThemeContext"
import { getActivity, saveLastLoadedLocationIdAndDistance } from "@/database/activities"
import { getLocationPointsUpToId, getNewLocationPointsById } from "@/database/locationPoints"
import { useAnimateCamera } from "@/hooks/useAnimateCamera"
import { useCheckIfActivityRunning } from "@/hooks/useCheckIfActivityRunning"
import { useCurrentLocation } from "@/hooks/useCurrentLocation"
import { useIfGpsServiceIsDisabled } from "@/hooks/useIfGpsServiceIsEnabled"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useLocationStore } from "@/store/locationStore"
import { getCurrentActivityId } from "@/utils/activity"
import { calculateAveragePace, calculateAverageSpeed, calculateMaxSpeed, fetchAndCalculateElevation } from "@/utils/calculateActivityStats"
import { Gps01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react-native"
import Mapbox, { Camera, LineLayer, MapView, ShapeSource, UserLocation } from "@rnmapbox/maps"
import Navigation from "@rnmapbox/navigation"
import * as Location from "expo-location"
import * as SQLite from "expo-sqlite"
import haversineDistance from "haversine-distance"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, Button, View, XStack } from "tamagui"
import ActivityStats from "../ActivityStats"
import PauseButton from "../buttons/PauseButton"
import ResumeButton from "../buttons/ResumeButton"
import StartButton from "../buttons/StartButton"
import StopButton from "../buttons/StopButton"
import GpsOffModal from "../modals/GpsOffModal"
import LessActivityModal from "../modals/LessActivityModal"
import ResumeModal from "../modals/resumeModal"


export default function MapBoxNew() {

    const { theme } = useTheme()
    // Map configuration
    Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)
    Navigation.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN)

    //state
    const [following, setFollowing] = useState<boolean>(true)
    const [isRouteRestored, setIsRouteRestored] = useState<boolean>(false)
    const prevPoint = useRef<{ latitude: number, longitude: number } | null>(null)

    // store
    const currentLocation = useLocationStore.getState().currentLocation
    const isRecording = useLocationStore.getState().isRecording
    const isPaused = useActivityPauseStore.getState().isActivityPaused
    const showResumeModal = useLocationStore.getState().showResumeModal
    const isGpsOff = useLocationStore((state) => state.isGpsOff)
    const setIsGpsOff = useLocationStore.getState().setIsGpsOff
    const routePoints = useLocationStore.getState().routeCoordinates
    const clearCoordinates = useLocationStore.getState().clearRoute
    const addCoordinate = useLocationStore.getState().addRouteCoordinate

    //useRef
    const lastLoadedId = useRef<number>(0)
    const mapRef = useRef<MapView>(null!)

    const isFetching = useRef<boolean>(false)

    // hooks
    useCurrentLocation()
    useCheckIfActivityRunning()
    const cameraRef = useAnimateCamera(currentLocation)
    useIfGpsServiceIsDisabled()


    const routeGeoJSON = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
            type: 'LineString' as const,
            coordinates: routePoints.map(point => [
                point.longitude,
                point.latitude,
            ]),
        },
    };

    // start points and end points
    const startPoint =
        routePoints.length > 0
            ? routePoints[0]
            : null;

    const endPoint =
        routePoints.length > 1
            ? routePoints[routePoints.length - 1]
            : null;



    useEffect(() => {
        const check = async () => {
            const enabled = await Location.hasServicesEnabledAsync();
            setIsGpsOff(!enabled)
        };
        check()
        const id = setInterval(check, 5000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (!isRecording) return

        let cancelled = false

        const restore = async () => {
            try {
                setIsRouteRestored(false)

                const activityId = await getCurrentActivityId()

                if (!activityId || cancelled) return

                const activity = await getActivity(activityId)

                if (cancelled) return

                const cursor = activity?.last_loaded_location_id ?? 0

                const points = await getLocationPointsUpToId(activityId, cursor)

                if (cancelled) return

                clearCoordinates()

                for (const point of points) {
                    if (cancelled) return
                    addCoordinate({
                        longitude: point.longitude,
                        latitude: point.latitude,
                        accuracy: point.accuracy,
                        altitude: point.altitude,
                        speed: point.speed,
                        heading: point.heading,
                    })
                }

                lastLoadedId.current = cursor

                prevPoint.current = null

                useActivityStatsStore.getState().setStats({
                    distance: activity?.distance ?? 0
                })

                setIsRouteRestored(true)

            }
            catch (error) {
                console.error("Activity Restoration Failed: ", error)
            }
        }

        restore()


        return () => {
            cancelled = true
        }
    }, [isRecording])

    useEffect(() => {
        if (!isRecording || isPaused || !isRouteRestored) return

        let cancelled = false

        // const loadRoute = async () => {
        const subscription = SQLite.addDatabaseChangeListener(async (event) => {
            if (event.tableName === "location_points") {
                if (isFetching.current) return

                isFetching.current = true

                try {
                    const activityId = await getCurrentActivityId()

                    if (!activityId || cancelled) return

                    const newPoints = await getNewLocationPointsById(
                        activityId, lastLoadedId.current ?? 0
                    )

                    if (cancelled || !newPoints.length) return

                    let addedDistance = 0
                    let processedId = lastLoadedId.current

                    for (const point of newPoints) {
                        if (cancelled) return

                        addCoordinate({
                            latitude: point.latitude,
                            longitude: point.longitude,
                            accuracy: point.accuracy,
                            altitude: point.altitude,
                            speed: point.speed,
                            heading: point.heading
                        })

                        const currentPoint = {
                            latitude: point.latitude,
                            longitude: point.longitude
                        }

                        if (prevPoint.current) {
                            addedDistance += haversineDistance(
                                prevPoint.current,
                                currentPoint
                            )
                        }

                        prevPoint.current = currentPoint
                        processedId = point.id
                    }

                    if (cancelled) return

                    const store = useActivityStatsStore.getState()
                    const newDistance = store.stats.distance + addedDistance

                    await saveLastLoadedLocationIdAndDistance(activityId, { distance: newDistance, lastProcessedPointId: processedId })

                    if (cancelled) return

                    lastLoadedId.current = processedId

                    store.setStats({
                        distance: newDistance
                    })

                    calculateMaxSpeed()
                    calculateAveragePace()
                    await fetchAndCalculateElevation()

                    if (cancelled) return

                    calculateAverageSpeed()
                }
                catch (error) {
                    console.error('Route polling failed: ', error)
                }

                finally {
                    isFetching.current = false
                }
            }

        })

        return () => {
            cancelled = true
            subscription.remove()
            prevPoint.current = null
        }


    }, [isRecording, isPaused, isRouteRestored])


    return (
        <View flex={1}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                styleURL={Mapbox.StyleURL.Outdoors}
                compassEnabled
                compassFadeWhenNorth={false}
                compassPosition={{ top: 300, right: 16 }}
                scaleBarEnabled={false}
                onCameraChanged={(event) => {
                    if (event.gestures.isGestureActive) {
                        setFollowing(false);
                    }
                }}
            >
                <Camera
                    ref={cameraRef}
                    followUserLocation={following}
                    followUserMode={isRecording ? Mapbox.UserTrackingMode.FollowWithHeading : Mapbox.UserTrackingMode.Follow}
                    followZoomLevel={following ? 19 : 3}
                    defaultSettings={{
                        centerCoordinate: [
                            currentLocation?.longitude ?? 72.8777,
                            currentLocation?.latitude ?? 19.076,
                        ],
                        zoomLevel: 19,
                    }}
                    minZoomLevel={3}
                    maxZoomLevel={19}
                />



                {routePoints.length > 1 && (
                    <ShapeSource
                        id="routeSource"
                        shape={routeGeoJSON}
                    >
                        <LineLayer
                            id="routeLine"
                            style={{
                                lineColor: '#0B1F3A',
                                lineWidth: 10,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </ShapeSource>
                )}

                <UserLocation
                    visible
                    requestsAlwaysUse
                    showsUserHeadingIndicator
                />
            </MapView>

            <AnimatePresence>
                <ActivityStats />
            </AnimatePresence>

            <View
                position="absolute"
                alignItems="center"
                bottom={24}
                left={0}
                right={0}
            >
                {isRecording ? (
                    <View marginHorizontal={15}>
                        {isPaused ? (
                            <XStack width="100%" alignItems="center" gap="$3">
                                <ResumeButton />
                                <StopButton mapRef={mapRef} cameraRef={cameraRef} />
                            </XStack>
                        ) : (
                            <PauseButton />
                        )}
                    </View>
                ) : (
                    <StartButton lastLoadedId={lastLoadedId} />
                )}
            </View>

            {!following && (
                <View
                    position="absolute"
                    right={18}
                    top="355"
                    zIndex={10}
                >
                    <Button
                        backgroundColor={theme.background}
                        circular
                        
                        onPress={() => setFollowing(true)}
                    >
                        <HugeiconsIcon
                            width={25}
                            height={25}
                            icon={Gps01Icon}
                            color={theme.text}
                        />
                    </Button>
                </View>
            )}

            <ResumeModal isVisible={showResumeModal} />
            <GpsOffModal isVisible={isGpsOff} />
            <LessActivityModal />
        </View>
    )
}