import { colors } from "@/constants/theme";
import { getActivity, saveLastLoadedLocationIdAndDistance } from "@/database/activities";
import { getLocationPointsUpToId, getNewLocationPointsById } from "@/database/locationPoints";
import { useCompassDirection } from "@/hooks/useCompassDirection";
import { checkIfActivityIsRunning } from "@/services/activity/activityService";
import { getCurrentLocation, stopWatchingLocation } from "@/services/locationService";
import { networkStatus } from "@/services/networkService";
import { useActivityPauseStore } from "@/store/ActivityPauseStore";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { useLocationStore } from "@/store/locationStore";
import { getCurrentActivityId } from "@/utils/activity";
import { calculateAveragePace, calculateAverageSpeed, calculateMaxSpeed, fetchAndCalculateElevation } from "@/utils/calculateActivityStats";
import { Camera, GeoJSONSource, Layer, Map, MapRef, Marker, UserLocation, type CameraRef } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import haversineDistance from "haversine-distance";
import { AnimatePresence } from "moti";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, View, XStack } from "tamagui";
import ActivityStats from "./ActivityStats";
import PauseButton from "./buttons/PauseButton";
import ResumeButton from "./buttons/ResumeButton";
import StartButton from "./buttons/StartButton";
import StopButton from "./buttons/StopButton";
import GpsOffModal from "./modals/GpsOffModal";
import LessActivityModal from "./modals/LessActivityModal";
import ResumeModal from "./modals/resumeModal";

export default function MapBox() {

    const insets = useSafeAreaInsets()

    // const compassHeading = useLocationStore(
    //     (state) => state.compassHeading
    // );


    const isRecording = useLocationStore(
        (state) => state.isRecording
    );

    const [mapBearing, setMapBearing] = useState(0);

    const isPaused = useActivityPauseStore(state => state.isActivityPaused)



    const showResumeModal = useLocationStore(
        (state) => state.showResumeModal
    )


    const clearCoordinates = useLocationStore(state => state.clearRoute)

    const addCoordinate = useLocationStore(
        (state) => state.addRouteCoordinate
    )

    useCompassDirection()

    const currentLocation = useLocationStore(
        (state) => state.currentLocation
    );

    const routeCoordinates = useLocationStore(
        (state) => state.routeCoordinates
    );

    const isGpsOff = useLocationStore(
        (state) => state.isGpsOff
    )

    const setIsGpsOff = useLocationStore(
        (state) => state.setIsGpsOff
    )




    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const heading = useCompassDirection()
    const cameraRef = useRef<CameraRef>(null);
    const mapRef = useRef<MapRef>(null!);


    const startPoint =
        routeCoordinates.length > 0
            ? routeCoordinates[0]
            : null;

    const endPoint =
        routeCoordinates.length > 1
            ? routeCoordinates[routeCoordinates.length - 1]
            : null;

    // const simplifiedRouteCoordinates = simplifyRoute(routeCoordinates) ?? routeCoordinates

    const routeGeoJSON = {
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: routeCoordinates.map((point) => [
                point.longitude,
                point.latitude
            ])
        },
    };

    useEffect(() => {
        const unsubscribe = networkStatus()

        return () => {
            unsubscribe()
        }
    }, [])


    useEffect(() => {
        const startLocationWatcher = async () => {
            try {
                await getCurrentLocation();
            } catch (error) {
                console.error(
                    "Location watcher error:",
                    error
                );

                if (error instanceof Error) {
                    setErrorMsg(error.message);
                } else {
                    setErrorMsg(
                        "Unable to get your location"
                    );
                }
            }
        };

        const checkIfActivityIsRunningAndPaused = async () => {
            await checkIfActivityIsRunning()
        }
        startLocationWatcher();
        checkIfActivityIsRunningAndPaused()

        return () => {
            stopWatchingLocation();
        };
    }, []);


    useEffect(() => {
        if (isRecording) return
        if (!currentLocation || !cameraRef.current) return

        cameraRef.current.easeTo({
            center: [
                currentLocation.longitude,
                currentLocation.latitude
            ],
            zoom: 19,
            duration: 1000
        })
    }, [currentLocation, isRecording])


    useEffect(() => {
        if (!isRecording) return
        if (routeCoordinates.length == 0 || !cameraRef.current) return

        const latestPoint = routeCoordinates[routeCoordinates.length - 1]

        cameraRef.current.easeTo({
            center: [
                latestPoint.longitude,
                latestPoint.latitude
            ],
            zoom: 19,
            duration: 1000
        })
    }, [routeCoordinates, isRecording])



    useEffect(() => {
        const check = async () => {
            const enabled = await Location.hasServicesEnabledAsync();
            setIsGpsOff(!enabled)
        };
        check()
        const id = setInterval(check, 5000);
        return () => clearInterval(id);
    }, []);


    // restore and starting routes
    const prevPoint = useRef<{ latitude: number, longitude: number } | null>(null)
    const lastLoadedId = useRef(0)
    const isFetching = useRef(false)
    const [isRouteRestored, setIsRouteRestored] = useState(false)

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

        const loadRoute = async () => {
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
                console.error('Route polling failed:', error)
            }

            finally {
                isFetching.current = false
            }
        }

        loadRoute()

        const interval = setInterval(loadRoute, 1000)

        return () => {
            cancelled = true
            clearInterval(interval)
            prevPoint.current = null
        }

    }, [isRecording, isPaused, isRouteRestored])



    return (
        <View flex={1}>
            <View flex={1}>
                <Map style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                    ref={mapRef}
                    mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`}
                    attributionPosition={{
                        bottom: 8,
                        right: 8,
                    }}

                // onRegionIsChanging={(event) => {
                //     const bearing = event.nativeEvent.bearing;

                //     if (Number.isFinite(bearing)) {
                //         setMapBearing(bearing);
                //     }
                // }}
                >
                    <Camera
                        ref={cameraRef}
                        initialViewState={{
                            center: [
                                currentLocation?.longitude ?? 72.8777,
                                currentLocation?.latitude ?? 19.0760,
                            ],
                            zoom: 19,
                            // pitch: 45
                        }}
                        minZoom={3}
                        maxZoom={19}
                        trackUserLocation="course"
                    />

                    {routeCoordinates.length > 1 && (
                        <GeoJSONSource
                            id="recorded-route"
                            data={routeGeoJSON}
                        >
                            <Layer
                                type="line"
                                id="recorded-route-line"
                                style={{
                                    lineColor:
                                        "#1397c3",
                                    lineWidth: 5,
                                    lineCap:
                                        "round",
                                    lineJoin:
                                        "round",
                                }}
                            />
                        </GeoJSONSource>
                    )}


                    {isRecording && (
                        <>
                            {startPoint && (
                                <Marker
                                    id="start-point"
                                    lngLat={[
                                        startPoint.longitude,
                                        startPoint.latitude,
                                    ]}
                                >
                                    <View
                                        borderColor={colors.primaryWhite}
                                        borderWidth={2}
                                        borderRadius="50%"
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            src={require("../assets/icons/flag.png")}
                                        />
                                    </View>
                                </Marker>
                            )}

                            {endPoint && (
                                <Marker
                                    id="end-point"
                                    lngLat={[
                                        endPoint.longitude,
                                        endPoint.latitude,
                                    ]}
                                >
                                    <View
                                        width={20}
                                        height={20}
                                        borderRadius={10}
                                        backgroundColor="red"
                                        borderWidth={3}
                                        borderColor="white"
                                    />

                                   
                                </Marker>
                            )}
                        </>
                    )}



                    {(currentLocation && !isRecording) &&
                        // <PulsingLocationPuck
                        //     latitude={currentLocation.latitude}
                        //     longitude={currentLocation.longitude}
                        //     accuracy={currentLocation.accuracy}
                        //     heading={compassHeading}
                        //     rotateWithHeading
                        //     mapBearing={mapBearing}
                        // />
                        <UserLocation
                            animated
                            accuracy
                            heading
                            minDisplacement={1}
                        />
                    }

                </Map>
            </View>
            <AnimatePresence>
                {
                    isRecording &&
                    <ActivityStats />
                }
            </AnimatePresence>


            <View position="absolute" justifyContent="center" alignItems="center" bottom={insets.bottom + 20} left={0} right={0}>

                {
                    isRecording ? (
                        <View marginHorizontal={15} >
                            {
                                isPaused ? (<XStack width={"100%"} alignItems="center" gap={"$3"}>
                                    <ResumeButton />
                                    <StopButton mapRef={mapRef} />
                                </XStack>) : (<PauseButton />)
                            }
                        </View>
                    ) : (
                        <View >
                            {
                                <StartButton lastLoadedId={lastLoadedId} />
                            }
                        </View>
                    )
                }
            </View>


            <ResumeModal isVisible={showResumeModal} />
            <GpsOffModal isVisible={isGpsOff} />
            <LessActivityModal />

        </View >
    );
}


