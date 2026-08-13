import { saveLocationPoints } from "@/utils/database";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store"

export const LOCATION_TASK_NAME = "stride_flow_location_task";

TaskManager.defineTask(
    LOCATION_TASK_NAME,
    async ({ data, error }) => {
        if (error) {
            console.error("Location task error:", error);
            return;
        }

        if (!data) {
            return;
        }

        const { locations } = data as {
            locations: Location.LocationObject[];
        };

        for (const location of locations) {
            const {
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                heading,
            } = location.coords;


            await saveLocationPoints({
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                timestamp: new Date(location.timestamp).toISOString()
            })

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            console.log("Altitude:", altitude);
            console.log("Accuracy:", accuracy);
            console.log("Speed:", speed);
            console.log("Heading:", heading);
            console.log("Timestamp:", location.timestamp);
            console.log("Activity_id: ", await SecureStore.getItemAsync("activity_id"))
        }


    }
);