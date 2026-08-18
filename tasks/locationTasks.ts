import { coordinateDistance } from "@/utils/coordinateDistance";
import { getLastLocationPoint, saveLocationPoints } from "@/utils/database";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
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

        const activity_id = await SecureStore.getItemAsync("activity_id")

        if (activity_id === null) {
            console.log("No activity ID Found")
            return
        }
        for (const location of locations) {
            const {
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                heading,
            } = location.coords;

            const previous_coordinates = await getLastLocationPoint(Number(activity_id))

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
            //Accuracy Check
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

            // check if timestamp is valid
            const previousTimestamp = new Date(previous_coordinates.timestamp).getTime()
            let timeDifference: number | null = null
            const currentTimestamp = location.timestamp
            if (previousTimestamp !== null) {
                timeDifference = (currentTimestamp - previousTimestamp) / 1000

                if (timeDifference <= 0) {
                    console.log("Rejected: Invalid Timestamp")
                    continue
                }

                const now = Date.now()

                const timeStampDifference = Math.abs(now - currentTimestamp) / 1000

                if (timeStampDifference > 60) {
                    console.log("Rejected: Timestamp too far from current time")
                    continue
                }
            }

            // check if speed is valid
            if (timeDifference !== null) {
                const calCulateSpeed = distance / timeDifference
                if (calCulateSpeed > 12) {
                    console.log("Rejected: Unrealistic Speed")
                    continue
                }
            }

            // check if distance is valid
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