import { getActivity } from "@/database/activities";
import { getLastLocationPoint, saveLocationPoint } from "@/database/locationPoints";
import { checkAndNotifyActivityInactivity, updateIsActiveNotificationSentStatus } from "@/services/activityInActiveService";
import { getCurrentActivityId } from "@/utils/activity";
import { kalmanFilter } from "@/utils/gps/filtering/kalmanFilter";
import { validateLocationPoint } from "@/utils/gps/validation/validateLocationPoints";
import { fileLog } from "@/utils/logging/fileLogger";
import logger from "@/utils/logging/logger";
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

        await fileLog(`RAW BATCH RECEIVED: ${locations.length} points`,
            locations.map(l => ({
                accuracy: l.coords.accuracy,
                timestamp: l.timestamp,
                latitude: l.coords.latitude,
                longitude: l.coords.longitude
            }))
        )

        const activity_id = await getCurrentActivityId()
        if (activity_id === null) {
            console.log("No activity ID Found")
            return
        }

        const activity = await getActivity(activity_id)
        if (!activity) {
            return
        }


        if (activity.status === 'paused') {
            return
        }

        await checkAndNotifyActivityInactivity()

        let previous_coordinates = await getLastLocationPoint(activity_id)
        const sortedLocations = [...locations].sort((a, b) => a.timestamp - b.timestamp)
        const gpsFilter = new kalmanFilter()
        for (const location of sortedLocations) {
            const {
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                heading
            } = location.coords;

            logger.info("GPS", "Coordinate Data", location.coords)

            // first point
            if (!previous_coordinates) {
                if (accuracy == null || accuracy > 25) {
                    logger.warn("GPS", "First Point Rejected: Poor Accuracy")
                    continue
                }
                await saveLocationPoint({
                    activityId: activity_id,
                    latitude,
                    longitude,
                    altitude: altitude ?? 0,
                    accuracy,
                    speed,
                    timestamp: new Date(location.timestamp).toISOString(),
                    heading: heading ?? 0
                }
                )
                await updateIsActiveNotificationSentStatus(false)
                continue
            }

            // if already some points available

            const result = validateLocationPoint(location, previous_coordinates)
            if (result.skip) {
                logger.warn("GPS", "Point skipped (no meaningful movement)", result.reason)
                continue
            }
            if (!result.valid) {
                logger.warn("GPS", `Point rejected for activity ${activity_id}: ${result.reason}`, location.coords)
                continue
            }

            const smoothed = gpsFilter.update(
                latitude,
                longitude,
                accuracy ?? 25,
                location.timestamp
            )

            await saveLocationPoint({
                activityId: activity_id,
                latitude: smoothed.latitude,
                longitude: smoothed.longitude,
                altitude: altitude ?? 0,
                accuracy,
                speed,
                timestamp: new Date(location.timestamp).toISOString(),
                heading: heading ?? 0
            })

            previous_coordinates = {
                ...previous_coordinates,
                accuracy: location.coords.accuracy ?? 0,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: new Date(location.timestamp).toISOString()
            }

            await updateIsActiveNotificationSentStatus(false)

        }
    }
);