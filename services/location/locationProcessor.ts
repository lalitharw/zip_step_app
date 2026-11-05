
import { lastLocationPointReference } from "@/common/types/location";

import { getActivity } from "@/database/activities";
import {
    getLastLocationPoint,
    saveLocationPoint,
} from "@/database/locationPoints";

import {
    checkAndNotifyActivityInactivity,
    updateIsActiveNotificationSentStatus,
} from "@/services/activityInActiveService";

import { getCurrentActivityId } from "@/utils/activity";
import { kalmanFilter } from "@/utils/gps/filtering/kalmanFilter";

import {
    MAX_ACCURACY_M,
    MAX_FIRST_POINT_ACCURACY_M,
    MAX_SPEED_BY_ACTIVITY,
} from "@/utils/gps/gpsConfig";

import { validateLocationPoint } from "@/utils/gps/validation/validateLocationPoints";
import logger from "@/utils/logging/logger";
import { getCachedUser } from "@/utils/userStorage";

import * as Location from "expo-location";

// One shared filter for foreground and background processing.
const gpsFilter = new kalmanFilter(3);

// Remember which activity owns the filter state.
let filterActivityId: number | null = null;

// Serialize all incoming GPS processing in this JS runtime.
let processingQueue: Promise<void> = Promise.resolve();

async function processLocations(
    locations: Location.LocationObject[]
): Promise<void> {
    if (locations.length === 0) return;

    const cachedUser = await getCachedUser();
    const userId = cachedUser?.id ?? null;

    if (userId == null) return;

    const activityId = await getCurrentActivityId();

    if (activityId === null) return;

    const activity = await getActivity(activityId);

    if (!activity || activity.status !== "running") return;

    // Reset filter when switching activities.
    if (filterActivityId !== activityId) {
        gpsFilter.reset();
        filterActivityId = activityId;
    }

    await checkAndNotifyActivityInactivity();

    // Always read the latest saved point when this queued
    // operation starts, not when the GPS callback fires.
    let lastLocationPoint: lastLocationPointReference | null =
        await getLastLocationPoint(activityId);

    const lastTimestamp = lastLocationPoint
        ? new Date(lastLocationPoint.timestamp).getTime()
        : 0;

    // Remove already-saved and duplicate timestamps.
    const seenTimestamps = new Set<number>();

    const sortedLocations = [...locations]
        .filter((location) => {
            if (
                !Number.isFinite(location.timestamp) ||
                location.timestamp <= lastTimestamp
            ) {
                return false;
            }

            if (seenTimestamps.has(location.timestamp)) {
                return false;
            }

            seenTimestamps.add(location.timestamp);
            return true;
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    const maxSpeed =
        MAX_SPEED_BY_ACTIVITY.walk

    for (const location of sortedLocations) {
        const {
            latitude,
            longitude,
            altitude,
            accuracy,
            speed,
            heading,
        } = location.coords;

        // Check GPS accuracy.
        const maxAccuracy = lastLocationPoint
            ? MAX_ACCURACY_M
            : MAX_FIRST_POINT_ACCURACY_M;

        if (
            accuracy == null ||
            accuracy <= 0 ||
            accuracy > maxAccuracy
        ) {
            continue;
        }

        // Validate movement against the last saved point.
        if (lastLocationPoint) {
            const validation = validateLocationPoint(
                location,
                lastLocationPoint,
                maxSpeed
            );

            if (validation.skip) {
                logger.warn(
                    "GPS",
                    "Point skipped: no meaningful movement",
                    validation.reason
                );
                continue;
            }

            if (!validation.valid) {
                logger.warn(
                    "GPS",
                    `Point rejected: ${validation.reason}`,
                    location.coords
                );
                continue;
            }
        }

        // Apply Kalman filter.
        const filtered = gpsFilter.update(
            latitude,
            longitude,
            accuracy,
            location.timestamp
        );

        if (!filtered) {
            logger.warn(
                "GPS",
                "Point rejected by Kalman filter",
                { timestamp: location.timestamp }
            );
            continue;
        }

        const timestamp = new Date(
            location.timestamp
        ).toISOString();

        // Save the filtered point.
        const savedId = await saveLocationPoint({
            activityId,
            latitude: filtered.latitude,
            longitude: filtered.longitude,
            altitude: altitude ?? 0,
            accuracy,
            speed,
            timestamp,
            heading: heading ?? 0,
            raw_latitude: latitude,
            raw_longitude: longitude,
            user_id: userId,
        });

        // Do not assume an insert succeeded.
        if (savedId === null) {
            lastLocationPoint =
                await getLastLocationPoint(activityId);

            continue;
        }

        // Update the previous point only after successful insertion.
        lastLocationPoint = {
            id: savedId,
            latitude: filtered.latitude,
            longitude: filtered.longitude,
            accuracy,
            timestamp,
        };

        await updateIsActiveNotificationSentStatus(false);
    }
}

/**
 * Shared entry point for foreground and background GPS updates.
 */
export function processLocationUpdates(
    locations: Location.LocationObject[]
): Promise<void> {
    const operation = processingQueue.then(() =>
        processLocations(locations)
    );

    // Keep the queue alive even if one operation fails.
    processingQueue = operation.catch((error) => {
        logger.error(
            "GPS",
            "Location processing failed",
            error
        );
    });

    return processingQueue;
}

/**
 * Reset the processor when an activity is completely finished.
 * Call only after stopping location updates and waiting for
 * pending processing to finish.
 */
export async function resetLocationProcessor(): Promise<void> {
    await processingQueue;

    gpsFilter.reset();
    filterActivityId = null;
}
