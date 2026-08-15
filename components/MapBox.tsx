import { startActivity, stopActivity } from "@/services/api/LocationApi";
import { getCurrentLocation, requestLocationPermission, startLocationTracking, stopLocationTracking, stopWatchingLocation, } from "@/services/location";
import { useLocationStore } from "@/store/locationStore";
import { Camera, GeoJSONSource, Layer, Map, Marker, UserLocation, type CameraRef } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-native";
import { Button, Spinner, Text, View, } from "tamagui";

export default function MapBox() {
    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";


    const isRecording = useLocationStore(
        (state) => state.isRecording
    );

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

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

    const cameraRef = useRef<CameraRef>(null);



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

        startLocationWatcher();

        return () => {
            console.log("Current location watcher stopped");

            stopWatchingLocation();
        };
    }, []);


    useEffect(() => {
        if (!currentLocation) {
            return;
        }
        ``
        console.log(
            "Current Location:",
            currentLocation
        );


        cameraRef.current?.easeTo({
            center: [
                currentLocation.longitude,
                currentLocation.latitude,
            ],
            duration: 200,
        });



    }, [
        currentLocation
    ]);



    useEffect(() => {
        if (!isRecording) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const gpsEnabled =
                    await Location.hasServicesEnabledAsync();

                if (!gpsEnabled) {
                    setErrorMsg(
                        "GPS is turned off. Please enable GPS to continue."
                    );
                }
            } catch (error) {
                console.error(
                    "GPS status check error:",
                    error
                );
            }
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);



    useEffect(() => {
        console.log(
            "Route Coordinates:",
            routeCoordinates
        );
    }, [routeCoordinates]);



    const handleStartTracking = async () => {
        try {
            setLoading(true);

            await requestLocationPermission();

            clearRoute();

            console.log("Route cleared");

            const activityStarted =
                await startActivity();

            if (!activityStarted) {
                console.log(
                    "Activity Not Started"
                );

                return;
            }

            const trackingStarted =
                await startLocationTracking();

            if (!trackingStarted) {
                console.log(
                    "Location tracking did not start"
                );

                return;
            }

            setIsRecording(true);

            console.log(
                "Recording started"
            );
        } catch (error) {
            console.error(
                "START ERROR:",
                error
            );

            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg(
                    "Something went wrong"
                );
            }
        } finally {
            setLoading(false);
        }
    };



    const handleStopTracking = async () => {
        try {
            setLoading(true);

            await stopLocationTracking();

            console.log(
                "Location tracking stopped"
            );

            const stoppedActivity =
                await stopActivity();

            if (!stoppedActivity) {
                console.log(
                    "Activity did not stop"
                );

                return;
            }

            setIsRecording(false);

            const finalRoute =
                useLocationStore.getState()
                    .routeCoordinates;

            console.log(
                "Final Route:",
                finalRoute
            );

            console.log(
                "Total points:",
                finalRoute.length
            );
        } catch (error) {
            console.error(
                "STOP ERROR:",
                error
            );

            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg(
                    "Something went wrong"
                );
            }
        } finally {
            setLoading(false);
        }
    };



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
                                        "#00FF00",
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
                    <Button
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


            <Modal
                visible={
                    errorMsg !== null
                }
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setErrorMsg(null)
                }
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent:
                            "center",
                        alignItems:
                            "center",
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                    }}
                >
                    <View
                        style={{
                            width: "85%",
                            padding: 20,
                            borderRadius: 15,
                            backgroundColor:
                                "black",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                color: "white",
                                fontWeight:
                                    "bold",
                            }}
                        >
                            Location Required
                        </Text>

                        <Text
                            style={{
                                color: "white",
                                marginTop: 10,
                                textAlign:
                                    "center",
                            }}
                        >
                            {errorMsg}
                        </Text>

                        <Button
                            borderRadius="$10"
                            onPress={() =>
                                setErrorMsg(
                                    null
                                )
                            }
                            width="100%"
                            paddingHorizontal={
                                30
                            }
                        >
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>

        </View>
    );
}