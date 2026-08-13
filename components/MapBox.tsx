import { startActivity, stopActivity } from "@/services/api/LocationApi";
import {
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking
} from "@/services/location";
import { getLocationPoints } from "@/utils/database";
import { useState } from "react";
import {
    Button,
    Spinner,
    Text,
    View
} from "tamagui";

import { Modal } from "react-native";

export default function MapBox() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [location, setLocation] = useState<Object | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const handleStartTracking = async () => {
        try {
            setLoading(true);

            await requestLocationPermission();

            const activityStarted = await startActivity();

            if (!activityStarted) {
                console.log("Activity Not Started");
                return;
            }

            const start = await startLocationTracking();

            if (start) {
                setIsRecording(true);
                console.log("Recording started");
            }

        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Something went wrong");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleStopTracking = async () => {
        try {
            setLoading(true);

            const stop = await stopLocationTracking();

            const stoppedActivity = await stopActivity();

            if (!stoppedActivity) {
                return;
            }

            if (stop) {
                setIsRecording(false);

                console.log("Recording Stopped");

                const points = await getLocationPoints();

                console.log("All Data:", points);
            }

        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Something went wrong");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <View flex={1}>

            {/* Start / Stop button */}
            <View
                padding={20}
                position="absolute"
                bottom={0}
                width="100%"
            >
                {isRecording ? (
                    <Button
                        borderRadius="$10"
                        onPress={handleStopTracking}
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
                        onPress={handleStartTracking}
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

            {/* Error Dialog */}
            <Modal
                visible={errorMsg !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setErrorMsg(null)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <View
                        style={{
                            width: "85%",
                            padding: 20,
                            borderRadius: 15,
                            backgroundColor: "black",
                        }}
                    >
                        <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
                            Location Required
                        </Text>

                        <Text style={{ color: "white", marginTop: 10, textAlign: "center" }}>
                            {errorMsg}
                        </Text>

                        <Button borderRadius={"$10"} onPress={() => setErrorMsg(null)} width={"100%"} paddingHorizontal={30}>
                            {isLoading ? <Spinner size="small" color="$green10" /> : "Sign Out"}
                        </Button>
                    </View>
                </View>
            </Modal>

        </View>
    );
}