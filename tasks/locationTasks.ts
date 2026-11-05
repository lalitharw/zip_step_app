
import { processLocationUpdates } from "@/services/location/locationProcessor";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "zip_step_location_task";

TaskManager.defineTask(
    LOCATION_TASK_NAME,
    async ({ data, error }) => {
        if (error) {
            console.error("Background location task error:", error);
            return;
        }

        if (!data) return;

        const { locations } = data as {
            locations: Location.LocationObject[];
        };

        try {
            await processLocationUpdates(locations);
        } catch (error) {
            console.error(
                "Background location processing failed:",
                error
            );
        }
    }
);
