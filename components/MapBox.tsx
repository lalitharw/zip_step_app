import { getNewLocationPointsById } from "@/database/locationPoints";
import { useCompassDirection } from "@/hooks/useCompassDirection";
import { checkIfActivityIsRunning } from "@/services/activity/activityService";
import { getCurrentLocation, stopWatchingLocation } from "@/services/locationService";
import { networkStatus } from "@/services/networkService";
import { useActivityPauseStore } from "@/store/ActivityPauseStore";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { useActivityStore } from "@/store/ActivityStore";
import { useLocationStore } from "@/store/locationStore";
import { getCurrentActivityId } from "@/utils/activity";
import { calculateAveragePace, calculateAverageSpeed, calculateMaxSpeed, fetchAndCalculateElevation } from "@/utils/calculateActivityStats";
import { Camera, GeoJSONSource, Layer, Map, MapRef, Marker, UserLocation, type CameraRef } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import haversineDistance from "haversine-distance";
import { AnimatePresence } from "moti";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, XStack } from "tamagui";
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
    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";
    const isRecording = useLocationStore(
        (state) => state.isRecording
    );

    const isPaused = useActivityPauseStore(state => state.isActivityPaused)

    let isFetching = useRef<boolean>(false)


    const showResumeModal = useLocationStore(
        (state) => state.showResumeModal
    )


    const setStats = useActivityStatsStore(
        (state) => state.setStats
    )

    const addCoordinate = useLocationStore(
        (state) => state.addRouteCoordinate
    )

    const activityId = useActivityStore(
        (state) => state.activityId
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
    const lastLoadedId = useRef<number | null>(0)

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



    useEffect(() => {
        if (!isRecording || isPaused) {
            return;
        }


        isFetching.current = false
        const loadRoute = async () => {
            if (isFetching.current) return
            isFetching.current = true
            try {
                const activity_id = await getCurrentActivityId()
                if (!activity_id) {
                    return
                }
                const newPoints = await getNewLocationPointsById(activity_id, lastLoadedId.current ?? 0)
                if (newPoints.length === 0) {
                    return
                }
                // for (const point of newPoints) {
                //     addCoordinate({
                //         longitude: point.longitude,
                //         latitude: point.latitude,
                //         accuracy: point.accuracy,
                //         altitude: point.altitude,
                //         speed: point.speed,
                //         heading: point.heading
                //     })


                // }
                let addedDistance = 0
                for (let i = 0; i < newPoints.length; i++) {
                    let point = newPoints[i]

                    addCoordinate({
                        longitude: point.longitude,
                        latitude: point.latitude,
                        accuracy: point.accuracy,
                        altitude: point.altitude,
                        speed: point.speed,
                        heading: point.heading
                    })

                    if (i > 0) {
                        addedDistance += haversineDistance(
                            {
                                latitude: newPoints[i - 1].latitude,
                                longitude: newPoints[i - 1].longitude
                            },
                            {
                                latitude: point.latitude,
                                longitude: point.longitude
                            }
                        )
                    }

                }

                if (addedDistance > 0) {
                    const store = useActivityStatsStore.getState()

                    store.setStats({
                        distance: store.stats.distance + addedDistance
                    })
                }

                try {
                    // calculateDistance();

                    calculateMaxSpeed();

                    calculateAveragePace();

                    await fetchAndCalculateElevation();

                    calculateAverageSpeed()

                }
                catch (statsError) {
                    console.error("Failed to update stats: ", statsError);
                }

                lastLoadedId.current = newPoints[newPoints.length - 1].id

            }
            catch (error) {
                console.error("Failed to refresh route: ", error)
            }
            finally {
                isFetching.current = false
            }
        }

        loadRoute()
        const routeInterval = setInterval(loadRoute, 2000)
        return () => {
            clearInterval(routeInterval)
        };
    }, [isRecording]);


    // useRouteTracking({isRecording,isPaused})


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
                    mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`}
                    attributionPosition={{
                        bottom: 8,
                        right: 8,
                    }}
                >
                    <Camera
                        ref={cameraRef}
                        initialViewState={{
                            center: [
                                currentLocation?.longitude ??
                                72.8777,
                                currentLocation?.latitude ??
                                19.0760,
                            ],
                            zoom: 19,
                        }}
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


                    {startPoint && (
                        <Marker
                            id="start-point"
                            lngLat={[
                                startPoint.longitude,
                                startPoint.latitude,
                            ]}
                        >
                            <View
                                width={20}
                                height={20}
                                borderRadius={10}
                                backgroundColor="green"
                                borderWidth={3}
                                borderColor="white"
                            />

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


                    {!(routeCoordinates.length > 0) &&
                        <UserLocation
                            animated
                            heading
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


            {/* 
            {
                isRecording && (
                    <View position="absolute" bottom={insets.bottom + 20} left={"15%"}>
                        {
                            isPaused ? <ResumeButton /> : <PauseButton />
                        }
                    </View>
                )
            }

            <View position="absolute" bottom={insets.bottom + 10} left={0} right={0} alignItems="center">
                {
                    isRecording ? (
                        <StopButton mapRef={mapRef} />
                    ) : (
                        <>
                            <StartButton lastLoadedId={lastLoadedId} />
                        </>
                    )
                }


            </View> */}
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


