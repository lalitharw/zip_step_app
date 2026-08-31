import { getNewLocationPointsById } from "@/database/locationPoints";
import { storePauseActivity, storeResumeActivity } from "@/services/ActivityPauseService";
import { checkIfActivityIsRunning, startActivity, stopActivity } from "@/services/activityService";
import { getCurrentLocation, stopWatchingLocation } from "@/services/locationService";
import { networkStatus } from "@/services/networkService";
import { useActivityPauseStore } from "@/store/ActivityPauseStore";
import { useLocationStore } from "@/store/locationStore";
import { getCurrentActivityId } from "@/utils/activity";
import { Camera, GeoJSONSource, Layer, Map, Marker, UserLocation, type CameraRef } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Button, Spinner, View, XGroup } from "tamagui";
import GpsOffModal from "./modals/GpsOffModal";
import ResumeModal from "./modals/resumeModal";

export default function MapBox() {
    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";


    const isRecording = useLocationStore(
        (state) => state.isRecording
    );

    const showResumeModal = useLocationStore(
        (state) => state.showResumeModal
    )

    const setCoordinate = useLocationStore(
        (state) => state.setRouteCoordinate
    )

    const addCoordinate = useLocationStore(
        (state) => state.addRouteCoordinate
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
    const [isLoading, setLoading] = useState(false);

    const cameraRef = useRef<CameraRef>(null);
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
            console.log("Current location watcher stopped");
            stopWatchingLocation();
        };
    }, []);


    useEffect(() => {
        if (!currentLocation) {
            return;
        }
        console.log(
            "Current Location:",
            currentLocation
        );
        cameraRef.current?.easeTo({
            center: [
                currentLocation.longitude,
                currentLocation.latitude,
            ],
            zoom: 18,
            duration: 2000
        });

    }, [
        currentLocation
    ]);

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

        // const checkGps = async () => {
        //     try {
        //         const gpsEnabled = await Location.hasServicesEnabledAsync()
        //         if (!gpsEnabled) {
        //             setIsGpsOff(true)
        //             // setErrorMsg("GPS is turned off. Please enable GPS to continue")
        //         }
        //         else {
        //             setIsGpsOff(false)
        //         }
        //     }
        //     catch (error) {
        //         console.error("GPS status check error: ", error)
        //     }
        // }

        const loadRoute = async () => {
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

                newPoints.forEach((point) => addCoordinate({
                    longitude: point.longitude,
                    latitude: point.latitude,
                    accuracy: point.accuracy
                }))

                lastLoadedId.current = newPoints[newPoints.length - 1].id

            }
            catch (error) {
                console.error("Failed to refresh route: ", error)
            }
        }

        // checkGps()
        loadRoute()
        // const gpsInterval = setInterval(checkGps, 3000)
        const routeInterval = setInterval(loadRoute, 2000)
        return () => {
            // clearInterval(gpsInterval);
            clearInterval(routeInterval)
        };
    }, [isRecording]);



    useEffect(() => {
        console.log(
            "Route Coordinates:",
            routeCoordinates
        );
    }, [routeCoordinates]);



    // const handleStartTracking = async () => {
    //     try {
    //         setLoading(true);
    //         lastLoadedId.current = null

    //         await startActivityService()

    //         console.log(
    //             "Recording started"
    //         );
    //     } catch (error) {
    //         console.error(
    //             "START ERROR:",
    //             error
    //         );

    //         if (error instanceof Error) {
    //             setErrorMsg(error.message);
    //         } else {
    //             setErrorMsg(
    //                 "Something went wrong"
    //             );
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleStartTracking = async () => {
        try {
            setLoading(true)
            lastLoadedId.current = 0
            await startActivity()
        }
        catch (error) {

        }
        finally {
            setLoading(false)
        }
    }



    // const handleStopTracking = async () => { 
    //     try {
    //         setLoading(true);
    //         await stopActivityService()
    //         console.log(
    //             "Location tracking stopped"
    //         );
    //         const finalRoute =
    //             useLocationStore.getState()
    //                 .routeCoordinates;

    //         console.log(
    //             "Final Route:",
    //             finalRoute
    //         );
    //         console.log(
    //             "Total points:",
    //             finalRoute.length
    //         );
    //     } catch (error) {
    //         console.error(
    //             "STOP ERROR:",
    //             error
    //         );

    //         if (error instanceof Error) {
    //             setErrorMsg(error.message);
    //         } else {
    //             setErrorMsg(
    //                 "Something went wrong"
    //             );
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleStopTracking = async () => {
        try {
            setLoading(true)
            await stopActivity()
        }
        catch (error) {

        }
        finally {
            setLoading(false)
        }
    }

    const handlePauseActivity = async () => {
        try {
            await storePauseActivity()
        }
        catch (error) {
            console.error("Something went wrong: ", error)
        }
    }

    const handleResumeActivity = async () => {
        try {

            await storeResumeActivity()
        }
        catch (error) {
            console.error("Something went wrong: ", error)
        }
    }


    return (
        <View flex={1}>
            <View
                height="100%"
                width="100%"
            >
                <Map
                    flex={1}
                    mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`}
                    logoEnabled
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


            <View
                padding={20}
                position="absolute"
                bottom={0}
                width="100%"
            >

                {isRecording ? (
                    <XGroup width="100%" gap={12} alignItems="center">
                        <Button
                            width={"40%"}
                            borderRadius="$10"
                            onPress={
                                (
                                    isPaused ? handleResumeActivity : handlePauseActivity
                                )
                            }
                        >
                            {
                                isPaused ? "Resume" : "Pause"
                            }
                        </Button>
                        <Button
                            flex={1}
                            borderRadius="$10"
                            onPress={
                                handleStopTracking
                            }
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner
                                    size="small"
                                    color="$green10"
                                />
                            ) : (
                                "Stop"
                            )}
                        </Button>
                    </XGroup>
                ) : (


                    <Button
                        borderRadius="$10"
                        onPress={
                            handleStartTracking
                        }
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Spinner
                                size="small"
                                color="$green10"
                            />
                        ) : (
                            "Start"
                        )}
                    </Button>
                )}
            </View>
            <ResumeModal isVisible={showResumeModal} />
            <GpsOffModal isVisible={isGpsOff} />

        </View>
    );
}