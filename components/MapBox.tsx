import { getNewLocationPointsById } from "@/database/locationPoints";
import { checkIfActivityIsRunning } from "@/services/activityService";
import { getCurrentLocation, stopWatchingLocation } from "@/services/locationService";
import { networkStatus } from "@/services/networkService";
import { useActivityPauseStore } from "@/store/ActivityPauseStore";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { useActivityStore } from "@/store/ActivityStore";
import { useLocationStore } from "@/store/locationStore";
import { getCurrentActivityId } from "@/utils/activity";
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime";
import { calculateActivityDistance, calculateActivityMaxSpeed, calculateAveragePace, calculateAverageSpeed, calculateElevationGain } from "@/utils/activityStats";
import { Camera, GeoJSONSource, Layer, Map, MapRef, Marker, UserLocation, type CameraRef } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { AnimatePresence } from "moti";
import { useEffect, useRef, useState } from "react";
import { View } from "tamagui";
import ActivityStats from "./ActivityStats";
import GpsOffModal from "./modals/GpsOffModal";
import ResumeModal from "./modals/resumeModal";
import PauseButton from "./PauseButton";
import ResumeButton from "./ResumeButton";
import StartButton from "./StartButton";
import StopButton from "./StopButton";

export default function MapBox() {
    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";
    const isRecording = useLocationStore(
        (state) => state.isRecording
    );

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

    const currentLocation = useLocationStore(
        (state) => state.currentLocation
    );

    const routeCoordinates = useLocationStore(
        (state) => state.routeCoordinates
    );

    const setIsRecording = useLocationStore(
        (state) => state.setIsRecording
    );

    const clearRoute = useLocationStore(
        (state) => state.clearRoute
    );

    const isGpsOff = useLocationStore(
        (state) => state.isGpsOff
    )

    const setIsGpsOff = useLocationStore(
        (state) => state.setIsGpsOff
    )

    const isPaused = useActivityPauseStore(
        (state) => state.isActivityPaused
    )

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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



    const routeGeoJSON = {
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: routeCoordinates.map((point) => [
                point.longitude,
                point.latitude,
            ]),
        },
    };

    useEffect(() => {
        if (!isRecording || !activityId) {
            return
        }
        const updateTimer = async () => {
            try {
                if (!activityId) {
                    throw new Error("Activity ID Not found")
                }

                const time = await getActivityElapsedTime(activityId)


                if (time !== null) {
                    setStats({
                        duration: time
                    })
                }
            }
            catch (error) {
                console.error("Something went wrong: ", error)
                throw error
            }
        }
        updateTimer()

        const interval = setInterval(updateTimer, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [isRecording, activityId])

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
        if (!currentLocation || !cameraRef.current) return

        cameraRef.current.easeTo({
            center: [
                currentLocation.longitude,
                currentLocation.latitude
            ],
            zoom: 19,
            duration: 1000
        })
    }, [currentLocation])

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
        if (!isRecording) {
            return;
        }

        let isFetching = false
        const loadRoute = async () => {
            if (isFetching) return
            isFetching = true
            try {
                const activity_id = await getCurrentActivityId()
                if (!activity_id) {
                    console.log("No Activity ID Found")
                    return
                }
                const newPoints = await getNewLocationPointsById(activity_id, lastLoadedId.current ?? 0)
                if (newPoints.length === 0) {
                    return
                }
                for (const point of newPoints) {
                    addCoordinate({
                        longitude: point.longitude,
                        latitude: point.latitude,
                        accuracy: point.accuracy,
                        altitude: point.altitude,
                        speed: point.speed
                    })

                    try {
                        calculateActivityDistance()
                        calculateActivityMaxSpeed()
                        calculateAveragePace()
                        calculateElevationGain()
                        calculateAverageSpeed()

                    }
                    catch (statsError) {
                        console.error("Failed to update stats: ", statsError);
                    }
                }

                lastLoadedId.current = newPoints[newPoints.length - 1].id

            }
            catch (error) {
                console.error("Failed to refresh route: ", error)
            }
            finally {
                isFetching = false
            }
        }

        loadRoute()
        const routeInterval = setInterval(loadRoute, 2000)
        return () => {
            clearInterval(routeInterval)
        };
    }, [isRecording]);



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


                    {
                        !(routeCoordinates.length > 0) &&
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



            {
                isRecording && (
                    <View position="absolute" bottom={30} left={"15%"}>
                        {
                            isPaused ? <ResumeButton /> : <PauseButton />
                        }
                    </View>
                )
            }

            <View position="absolute" bottom={20} left={0} right={0} alignItems="center">
                {
                    isRecording ? (
                        <StopButton mapRef={mapRef} />
                    ) : (

                        <StartButton lastLoadedId={lastLoadedId} />
                    )
                }


            </View>
            <ResumeModal isVisible={showResumeModal} />
            <GpsOffModal isVisible={isGpsOff} />

        </View >
    );
}