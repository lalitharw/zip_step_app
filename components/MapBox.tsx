import { startActivity, stopActivity } from "@/services/api/LocationApi";
import { requestLocationPermission, startLocationTracking, stopLocationTracking } from "@/services/location";
import { useState } from "react";
import { Button, View } from "tamagui";

export default function MapBox() {
    const [errorMsg, setErrorMsg] = useState<string | null>();
    const [location, setLocation] = useState<Object | null>();
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const handleStartTracking = async () => {
        try {
            await requestLocationPermission()
            const activityStarted = await startActivity()
            if (!activityStarted) {
                console.log("Activity Not Started")
                return
            }

            const start = await startLocationTracking();

            if (start) {
                setIsRecording(true)
                console.log("Recording started")

            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleStopTracking = async () => {
        try {
            const stop = await stopLocationTracking()
            const stoppedActivity = await stopActivity()
            if (!stoppedActivity) {
                return
            }
            if (stop) {
                setIsRecording(false)
                console.log("Recording Stopped")
            }
        }
        catch (error) {
            console.error(error)
        }
    }






    return (
        <View>
            {
                isRecording ?
                    <Button onPress={handleStopTracking}>Stop Tracking</Button> :
                    <Button onPress={handleStartTracking}>Start Tracking</Button>
            }
        </View>
        // <View>
        //     <MapView
        //         style={{ flex: 1 }}
        //         mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=xvEVbRhauAEaNQ1Ucv4L`}
        //         logoEnabled={false}
        //         attributionPosition={{
        //             bottom: 8,
        //             right: 8,
        //         }}
        //     >
        //         {
        //             location ? <Camera
        //                 centerCoordinate={[
        //                     location.coords.longitude, location.coords.latitude
        //                 ]}
        //                 zoomLevel={10}
        //                 animationDuration={1000}
        //                 animationMode="easeTo"
        //             /> : <Camera
        //                 centerCoordinate={[72.8777, 19.0760]}
        //                 zoomLevel={10}
        //                 animationDuration={1000}
        //                 animationMode="easeTo"
        //             />
        //         }

        //     </MapView>
        // </View>
    )
}