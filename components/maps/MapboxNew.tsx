import { useTheme } from "@/context/ThemeContext"
import { getActivity, saveLastLoadedLocationIdAndDistance } from "@/database/activities"
import { getLocationPointsUpToId, getNewLocationPointsById } from "@/database/locationPoints"
import { useAnimateCamera } from "@/hooks/useAnimateCamera"
import { useCheckIfActivityRunning } from "@/hooks/useCheckIfActivityRunning"
import { useCurrentLocation } from "@/hooks/useCurrentLocation"
import { useIfGpsServiceIsDisabled } from "@/hooks/useIfGpsServiceIsEnabled"
import useNetworkStatus from "@/hooks/useNetworkStatus"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useLocationStore } from "@/store/locationStore"
import { getCurrentActivityId } from "@/utils/activity"
import { calculateAveragePace, calculateAverageSpeed, calculateMaxSpeed, fetchAndCalculateElevation } from "@/utils/calculateActivityStats"
import logger from "@/utils/logging/logger"
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
    const [locationReady, SetLocationReady] = useState<boolean>(false)

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
    useNetworkStatus()


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
        const initialiseLocation = async () => {
            const { status } = await Location.getForegroundPermissionsAsync()
            logger.info("status", "", status)

            if (status === "granted") {
                SetLocationReady(true)
            }
        }

        initialiseLocation()
    }, [])

    // useEffect(() => {
    //     const check = async () => {
    //         const enabled = await Location.hasServicesEnabledAsync();
    //         setIsGpsOff(!enabled)
    //     };
    //     check()
    //     const id = setInterval(check, 5000);
    //     return () => clearInterval(id);
    // }, []);

    useEffect(() => {
        if (!isRecording) {
            setIsRouteRestored(false)
            lastLoadedId.current = 0
            prevPoint.current = null
            return
        }

        let cancelled = false

        const restoreRoute = async () => {
            try {
                setIsRouteRestored(false)

                const activityId = await getCurrentActivityId()

                if (cancelled) return

                if (!activityId) {
                    lastLoadedId.current = 0
                    prevPoint.current = null

                    useLocationStore.getState().setRouteCoordinate([])
                    useActivityStatsStore.getState().setStats({
                        distance: 0
                    })

                    setIsRouteRestored(true)
                    return
                }

                const activity = await getActivity(activityId)

                if (cancelled) return

                if (!activity) {
                    lastLoadedId.current = 0
                    prevPoint.current = null
                    setIsRouteRestored(true)
                    return
                }

                const cursor = activity.last_loaded_location_id ?? 0

                // Restore only points that have already been processed.
                const points = await getLocationPointsUpToId(
                    activityId,
                    cursor
                )

                if (cancelled) return

                const coordinates = points.map((point) => ({
                    id: point.id,
                    latitude: point.latitude,
                    longitude: point.longitude,
                    accuracy: point.accuracy,
                    altitude: point.altitude,
                    speed: point.speed,
                    heading: point.heading
                }))

                useLocationStore.getState().setRouteCoordinate(coordinates)

                lastLoadedId.current = cursor

                const lastPoint = points[points.length - 1]

                prevPoint.current = lastPoint
                    ? {
                        latitude: lastPoint.latitude,
                        longitude: lastPoint.longitude
                    }
                    : null

                useActivityStatsStore.getState().setStats({
                    distance: activity.distance ?? 0
                })

                setIsRouteRestored(true)
            } catch (error) {
                console.error("Activity Restoration Failed:", error)
                // Leave isRouteRestored false so the listener doesn't process
                // points against an incomplete restoration.
            }
        }

        void restoreRoute()

        return () => {
            cancelled = true
        }
    }, [isRecording])

    useEffect(() => {
        if (!isRecording || isPaused || !isRouteRestored) {
            return
        }

        let cancelled = false

        // These variables belong to this subscription instance.
        let drainPromise: Promise<void> | null = null
        let drainRequested = false

        /**
         * Fetch and process all points that are newer than our saved cursor.
         *
         * This function keeps querying until SQLite has no more unprocessed
         * points. It does not rely on receiving one event per inserted point.
         */
        const processPendingPoints = async () => {
            while (!cancelled) {
                const activityId = await getCurrentActivityId()

                if (!activityId || cancelled) return

                const activity = await getActivity(activityId)

                if (!activity || cancelled) return

                const cursor = lastLoadedId.current

                const newPoints = await getNewLocationPointsById(
                    activityId,
                    cursor
                )

                if (cancelled) return

                // Nothing is waiting in SQLite right now.
                if (!newPoints.length) return

                let previous = prevPoint.current
                let addedDistance = 0
                let processedId = cursor

                for (const point of newPoints) {
                    const currentPoint = {
                        latitude: point.latitude,
                        longitude: point.longitude
                    }

                    if (previous) {
                        addedDistance += haversineDistance(
                            previous,
                            currentPoint
                        )
                    }

                    previous = currentPoint
                    processedId = point.id
                }

                const newDistance =
                    (activity.distance ?? 0) + addedDistance

                /*
                 * Persist the distance and cursor together.
                 *
                 * Do this before updating Zustand. If the app closes after
                 * this database write, restoration can use the saved cursor.
                 */
                await saveLastLoadedLocationIdAndDistance(activityId, {
                    distance: newDistance,
                    lastProcessedPointId: processedId
                })

                lastLoadedId.current = processedId
                prevPoint.current = previous

                if (cancelled) return

                

                useActivityStatsStore.getState().setStats({
                    distance: newDistance
                })

                useLocationStore.getState().addRouteCoordinates(
                    newPoints.map((point) => ({
                        id: point.id,
                        latitude: point.latitude,
                        longitude: point.longitude,
                        accuracy: point.accuracy,
                        altitude: point.altitude,
                        speed: point.speed,
                        heading: point.heading
                    }))
                )

                // Keep your existing activity-stat calculations.
                calculateMaxSpeed()
                calculateAveragePace()
                await fetchAndCalculateElevation()
                calculateAverageSpeed()

                if (cancelled) return

                /*
                 * Don't stop after one batch. Query again using the updated
                 * cursor in case more points were inserted while we worked.
                 */
            }
        }

        /**
         * Queue a drain request.
         *
         * Multiple SQLite events can arrive close together. Instead of
         * starting multiple processors or dropping events, they all request
         * another pass through the same processor.
         */
        const requestDrain = () => {
            drainRequested = true

            if (drainPromise) return

            drainPromise = (async () => {
                while (drainRequested && !cancelled) {
                    drainRequested = false

                    try {
                        await processPendingPoints()
                    } catch (error) {
                        console.error("Route processing failed:", error)
                        // The cursor hasn't advanced if persistence failed.
                        // A later event or re-subscription can retry the points.
                    }
                }
            })().finally(() => {
                drainPromise = null

                // Handle a request that arrived as the previous drain ended.
                if (drainRequested && !cancelled) {
                    requestDrain()
                }
            })
        }

        /*
         * Subscribe first. This closes the gap where a point could be
         * inserted after restoration but before the listener was registered.
         */
        const subscription = SQLite.addDatabaseChangeListener((event) => {
            if (event.tableName === "location_points") {
                requestDrain()
            }   
        })

        /*
         * Immediately catch up after subscribing.
         *
         * This also handles points inserted while the app was paused,
         * while the screen was restoring, or before this listener existed.
         */
        requestDrain()

        return () => {
            cancelled = true
            drainRequested = false
            subscription.remove()
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
                                lineWidth: 8,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </ShapeSource>
                )}

                {
                    locationReady && <UserLocation
                        visible
                        requestsAlwaysUse
                        showsUserHeadingIndicator
                    />
                }

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
            <GpsOffModal isVisible={isGpsOff} onClose={() => setIsGpsOff(false)} />
            <LessActivityModal />
        </View>
    )
}