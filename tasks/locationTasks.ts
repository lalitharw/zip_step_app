import { lastLocationPointReference } from "@/common/types/location";
import { getActivity } from "@/database/activities";
import { getLastLocationPoint, saveLocationPoint } from "@/database/locationPoints";
import { checkAndNotifyActivityInactivity, updateIsActiveNotificationSentStatus } from "@/services/activityInActiveService";
import { getCurrentActivityId } from "@/utils/activity";
import { kalmanFilter } from "@/utils/gps/filtering/kalmanFilter";
import { MAX_ACCURACY_M, MAX_FIRST_POINT_ACCURACY_M, MAX_SPEED_BY_ACTIVITY } from "@/utils/gps/gpsConfig";
import { validateLocationPoint } from "@/utils/gps/validation/validateLocationPoints";
import logger from "@/utils/logging/logger";
import { getCachedUser } from "@/utils/userStorage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "stride_flow_location_task";

const gpsFilter = new kalmanFilter(3)
let filterActivityId: number | null = null


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


        const cachedUser = await getCachedUser()
        const userId = cachedUser?.id ?? null

        const activity_id = await getCurrentActivityId()
        if (activity_id === null) {
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

        if (filterActivityId !== activity_id) {
            gpsFilter.reset()
            filterActivityId = activity_id
        }

        let lastLocationPoint: lastLocationPointReference | null = await getLastLocationPoint(activity_id)

        // skip locations that were already saved, then process in time order
        const lastTs = lastLocationPoint ? new Date(lastLocationPoint.timestamp).getTime() : 0
        const sortedLocations = [...locations]
            .filter(l => l.timestamp > lastTs)
            .sort((a, b) => a.timestamp - b.timestamp)

        // NOTE: change `activity.type` if your field is named differently.
        // Falls back to walk (strictest), not the loose default.
        const maxSpeed = MAX_SPEED_BY_ACTIVITY.walk

        for (const location of sortedLocations) {
            const {
                latitude,
                longitude,
                altitude,
                accuracy,
                speed,
                heading
            } = location.coords;

            logger.info("GPS", "", location.coords)

            // accuracy check
            const maxAcc = lastLocationPoint ? MAX_ACCURACY_M : MAX_FIRST_POINT_ACCURACY_M
            if (accuracy == null || accuracy <= 0 || accuracy > maxAcc) {
                continue
            }

            // first point
            if (!lastLocationPoint) {
                const filtered = gpsFilter.update(latitude, longitude, accuracy, location.timestamp)
                await saveLocationPoint({
                    activityId: activity_id,
                    latitude: filtered.latitude,
                    longitude: filtered.longitude,
                    altitude: altitude ?? 0,
                    accuracy,
                    speed,
                    timestamp: new Date(location.timestamp).toISOString(),
                    heading: heading ?? 0,
                    raw_latitude: latitude,
                    raw_longitude: longitude,
                    user_id: userId
                })

                lastLocationPoint = {
                    latitude: filtered.latitude,
                    longitude: filtered.longitude,
                    accuracy,
                    timestamp: new Date(location.timestamp).toISOString()
                }
                await updateIsActiveNotificationSentStatus(false)
                continue
            }

            // if already some points available
            const result = validateLocationPoint(location, lastLocationPoint, maxSpeed)
            if (result.skip) {
                logger.warn("GPS", "Point skipped (no meaningful movement)", result.reason)
                continue
            }
            if (!result.valid) {
                logger.warn("GPS", `Point rejected for activity ${activity_id}: ${result.reason}`, location.coords)
                continue
            }

            // kalman filtering
            const filtered = gpsFilter.update(latitude, longitude, accuracy, location.timestamp)

            await saveLocationPoint({
                activityId: activity_id,
                latitude: filtered.latitude,
                longitude: filtered.longitude,
                altitude: altitude ?? 0,
                accuracy,
                speed,
                timestamp: new Date(location.timestamp).toISOString(),
                heading: heading ?? 0,
                raw_latitude: latitude,
                raw_longitude: longitude,
                user_id: userId
            })

            lastLocationPoint = {
                ...lastLocationPoint,
                accuracy,
                latitude: filtered.latitude,
                longitude: filtered.longitude,
                timestamp: new Date(location.timestamp).toISOString()
            }

            await updateIsActiveNotificationSentStatus(false)
        }
    }
);