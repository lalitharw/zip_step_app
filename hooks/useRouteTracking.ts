import { getDistanceMeters, getLastLoadedLocationId, saveLastLoadedLocationIdAndDistance } from "@/database/activities";
import { getNewLocationPointsById } from "@/database/locationPoints";
import { useActivityStatsStore } from "@/store/ActivityStatsStore";
import { useLocationStore } from "@/store/locationStore";
import { getCurrentActivityId } from "@/utils/activity";
import { calculateAveragePace, calculateAverageSpeed, calculateMaxSpeed, fetchAndCalculateElevation } from "@/utils/calculateActivityStats";
import haversine from 'haversine-distance';
import { useEffect, useRef } from "react";


type useRouteTrackingProps = {
    isRecording: boolean
    isPaused: boolean
}


export function useRouteTracking({
    isRecording,
    isPaused,
}: useRouteTrackingProps) {
    const isFetching = useRef(false);
    
    useEffect(() => {
        if (!isRecording) return;

        let cancelled = false;

        const loadRoute = async () => {
            if (isFetching.current || cancelled) return;

            isFetching.current = true;

            try {
                const activityId = await getCurrentActivityId();
                if (!activityId || cancelled) return;

                const savedDistance = await getDistanceMeters(activityId);
                if (cancelled) return;

                const lastLoadedId =
                    await getLastLoadedLocationId(activityId);
                if (cancelled) return;

                const newPoints = await getNewLocationPointsById(
                    activityId,
                    lastLoadedId
                );
                if (cancelled || newPoints.length === 0) return;

                const existing =
                    useLocationStore.getState().routeCoordinates;

                let previousPoint =
                    existing.length > 0
                        ? existing[existing.length - 1]
                        : null;

                let addedDistance = 0;

                for (const point of newPoints) {
                    if (cancelled) return;

                    const currentPoint = {
                        latitude: point.latitude,
                        longitude: point.longitude,
                        accuracy: point.accuracy,
                        altitude: point.altitude,
                        speed: point.speed,
                        heading: point.heading,
                    };

                    if (previousPoint) {
                        const segmentDistance = haversine(
                            {
                                lat: previousPoint.latitude,
                                lng: previousPoint.longitude,
                            },
                            {
                                lat: currentPoint.latitude,
                                lng: currentPoint.longitude,
                            }
                        );

                        if (
                            Number.isFinite(segmentDistance) &&
                            segmentDistance > 0
                        ) {
                            addedDistance += segmentDistance;
                        }
                    }

                    useLocationStore
                        .getState()
                        .addRouteCoordinate(currentPoint);

                    previousPoint = currentPoint;
                }

                if (cancelled) return;

                const latestId = newPoints[newPoints.length - 1].id;
                const newTotalDistance = savedDistance + addedDistance;

                // Must save both values atomically in SQLite.
                await saveLastLoadedLocationIdAndDistance(
                    latestId,
                    activityId,
                    newTotalDistance
                );

                if (cancelled) return;

                useActivityStatsStore.getState().setStats({
                    distance: newTotalDistance,
                });

                calculateMaxSpeed();
                calculateAveragePace();
                calculateAverageSpeed();

                // Prefer doing this once per batch if appropriate.
                await fetchAndCalculateElevation();
            } catch (error) {
                console.error("Failed to refresh route:", error);
            } finally {
                isFetching.current = false;
            }
        };

        void loadRoute();

        const interval = setInterval(() => {
            void loadRoute();
        }, 2000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [isRecording, isPaused]);
}
