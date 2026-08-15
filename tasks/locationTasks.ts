import { useLocationStore } from "@/store/locationStore";
import { saveLocationPoints } from "@/utils/database";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "stride_flow_location_task";

TaskManager.defineTask(
    LOCATION_TASK_NAME,
    async ({ data, error }) => {
        const locationStore = useLocationStore.getState()

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

            console.log("Latitude: ", latitude)
            console.log("Longitude: ", longitude)

            await saveLocationPoints({
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                timestamp: new Date(location.timestamp).toISOString()
            })
            locationStore.addRouteCoordinate({
                longitude: longitude,
                latitude: latitude
            })
        }
    }
);