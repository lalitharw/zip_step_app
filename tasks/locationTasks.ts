import { useLocationStore } from "@/store/locationStore";
import { coordinateDistance } from "@/utils/coordinateDistance";
import { saveLocationPoints } from "@/utils/database";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

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
        const routeCoordinates = useLocationStore.getState().routeCoordinates
        for (const location of locations) {
            const previous_coordinates = useLocationStore.getState().routeCoordinates[routeCoordinates.length - 1]
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
            console.log("Accuracy:", accuracy)

            // first point
            if (!previous_coordinates) {
                if (accuracy == null || accuracy <= 30) {
                    console.log("Adding first point")
                    await saveLocationPoints({
                        latitude,
                        longitude,
                        altitude,
                        accuracy,
                        speed,
                        timestamp: new Date(location.timestamp).toISOString()
                    })
                   
                }

                continue
            }

            // if already some points available
            if (accuracy == null || accuracy > 30) {
                console.log("Rejected: Poor Accuracy")
                continue
            }

            // calculate distance
            const distance = coordinateDistance({
                lat1: previous_coordinates.latitude,
                lon1: previous_coordinates.longitude,
                lat2: latitude,
                lon2: longitude
            })

            console.log("Distance: ", distance)

            if (distance > 100) {
                console.log("Rejected: Distance is more than 100m")
                continue
            }

            await saveLocationPoints({
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                timestamp: new Date(location.timestamp).toISOString()
            })
            
        }
    }
);