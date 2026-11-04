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


    useEffect(() => {
        if (!isRecording) {
            setIsRouteRestored(false)
            lastLoadedId.current = 0
            prevPoint.current = null
            return
        }

        let cancelled = false

        const resetEmpty = () => {
            lastLoadedId.current = 0
            prevPoint.current = null

            useLocationStore.getState().setRouteCoordinate([])
            useActivityStatsStore.getState().setStats({ distance: 0 })

            setIsRouteRestored(true)
        }

        const restoreRoute = async () => {
            try {
                setIsRouteRestored(false)

                const activityId = await getCurrentActivityId()
                if (cancelled) return

                if (!activityId) {
                    resetEmpty()
                    return
                }

                const activity = await getActivity(activityId)
                if (cancelled) return

                if (!activity) {
                    resetEmpty()
                    return
                }

                const cursor = activity.last_loaded_location_id ?? 0

                // Restore only points that have already been processed.
                const points = await getLocationPointsUpToId(activityId, cursor)
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
        let running = false
        let again = false


        const processPendingPoints = async () => {
            while (!cancelled) {
                const activityId = await getCurrentActivityId()
                if (!activityId || cancelled) return

                const activity = await getActivity(activityId)
                if (!activity || cancelled) return

                const cursor = lastLoadedId.current

                const newPoints = await getNewLocationPointsById(activityId, cursor)
                if (cancelled) return
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
                        addedDistance += haversineDistance(previous, currentPoint)
                    }

                    previous = currentPoint
                    processedId = point.id
                }

                const newDistance = (activity.distance ?? 0) + addedDistance

                await saveLastLoadedLocationIdAndDistance(activityId, {
                    distance: newDistance,
                    lastProcessedPointId: processedId
                })

                lastLoadedId.current = processedId
                prevPoint.current = previous

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

                if (cancelled) return

                calculateMaxSpeed()
                calculateAveragePace()
                await fetchAndCalculateElevation()
                calculateAverageSpeed()
            }
        }


        const requestDrain = async () => {
            if (running) {
                again = true
                return
            }
            running = true
            try {
                do {
                    again = false
                    await processPendingPoints()
                }
                while (again && !cancelled)
            }
            catch (error) {
                console.error("Route Processing failed: ", error)
            }
            finally {
                running = false
            }
        }

        const subscription = SQLite.addDatabaseChangeListener((event) => {
            if (event.tableName === "location_points") {
                requestDrain()
            }
        })

        requestDrain()

        return () => {
            cancelled = true
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