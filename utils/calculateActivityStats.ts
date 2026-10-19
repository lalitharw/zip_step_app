import { useActivityStatsStore } from "@/store/ActivityStatsStore"
import { useLocationStore } from "@/store/locationStore"
import haversine from 'haversine-distance'
import logger from "./logging/logger"


export function calculateDistance() {
    try {
        const routeCoordinates = useLocationStore.getState().routeCoordinates
        if (routeCoordinates.length < 2) return
        const previousPoint = routeCoordinates[routeCoordinates.length - 2]
        const currentPoint = routeCoordinates[routeCoordinates.length - 1]

        if (
            !Number.isFinite(previousPoint.latitude) ||
            !Number.isFinite(previousPoint.longitude) ||
            !Number.isFinite(currentPoint.latitude) ||
            !Number.isFinite(currentPoint.longitude)
        ) {
            return;
        }

        const distance = haversine(
            {
                latitude: previousPoint.latitude,
                longitude: previousPoint.longitude
            },
            {
                latitude: currentPoint.latitude,
                longitude: currentPoint.longitude
            }
        )

        if (!Number.isFinite(distance) || distance <= 0) return

        const store = useActivityStatsStore.getState()
        const currentDistance = store.stats.distance

        store.setStats({
            distance: currentDistance + distance
        })

        logger.info(
            "Distance",
            "Activity Stats Distance (metres)",
            distance,
        );


    }
    catch (error) {
        console.error("Something went wrong: ", error)
        throw error
    }
}


export function calculateAverageSpeed() {
    const { distance, duration } = useActivityStatsStore.getState().stats;

    if (distance <= 0 || duration <= 0) return;

    const durationSeconds = duration / 1000;

    useActivityStatsStore.getState().setStats({
        averageSpeed: distance / durationSeconds,
    });
}


export function calculateAveragePace() {

    const { distance, duration } = useActivityStatsStore.getState().stats;

    logger.info("Distance", "", distance)
    logger.info("Duration", "", duration)
    if (distance <= 50 || duration <= 0) {
        useActivityStatsStore.getState().setStats({
            averagePace: 0
        });
        return;
    }




    const paceSecondsPerKm = (duration / 1000) / (distance / 1000);

    useActivityStatsStore.getState().setStats({
        averagePace: paceSecondsPerKm,
    });
}



export function calculateMaxSpeed() {
    const routeCoordinates = useLocationStore.getState().routeCoordinates
    let latestPoint = routeCoordinates[routeCoordinates.length - 1]
    if (!latestPoint || latestPoint?.speed == null) return
    const maxSpeed = useActivityStatsStore.getState().stats.maxSpeed
    useActivityStatsStore.getState().setStats({
        maxSpeed: Math.max(maxSpeed, latestPoint.speed),
        currentSpeed: latestPoint.speed
    })
}




export async function fetchAndCalculateElevation() {
    const coordinates = useLocationStore.getState().routeCoordinates

    if (coordinates.length < 2) return

    const currentCoordinate = coordinates[coordinates.length - 1]

    const url = `https://api.open-meteo.com/v1/elevation?latitude=${currentCoordinate.latitude}&longitude=${currentCoordinate.longitude}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Elevation API error: ${response.status}`)
        }

        const data = await response.json()



        const elevation = data?.elevation[0]

        if (typeof elevation !== "number" || !Number.isFinite(elevation)) return

        calculateElevation(elevation)
    }
    catch (error) {
        logger.error("Error retrieving elevation", "", error);
    }
}



const ELEVATION_THRESHOLD = 3;
let previousElevation: number | null = null
export function calculateElevation(currentElevation: number) {
    const store = useActivityStatsStore.getState()

    const { elevationGain, elevationLoss } = store.stats

    if (!Number.isFinite(currentElevation)) return

    let gain = elevationGain
    let loss = elevationLoss

    if (previousElevation === null) {
        previousElevation = currentElevation

        store.setStats({
            currentElevation: currentElevation
        })

        return
    }

    const difference = currentElevation - previousElevation

    if (difference >= ELEVATION_THRESHOLD) {
        gain += difference
        previousElevation = currentElevation

    }
    else if (difference <= -ELEVATION_THRESHOLD) {
        loss += Math.abs(difference)
        previousElevation = currentElevation
    }

    store.setStats({
        currentElevation,
        elevationGain: gain,
        elevationLoss: loss
    })
}



