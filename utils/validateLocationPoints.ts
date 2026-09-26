import { coordinateDistance } from "./coordinateDistance";
import logger from "./logger";

type LocationPointType = {
    coords: {
        latitude: number,
        longitude: number,
        altitude: number | null,
        accuracy: number | null,
        speed: number | null,
        heading: number | null
    },
    timestamp: number
}

type PreviousLocationType = {
    latitude: number;
    longitude: number;
    accuracy?: number | null
    timestamp: string | number | Date;
};

type validateLocationPointReturnType = {
    valid: boolean,
    reason: string | null,
    skip?: boolean   // true = not an error, just nothing new to save
}

export function validateLocationPoint(location: LocationPointType, previousLocation: PreviousLocationType): validateLocationPointReturnType {
    try {
        const {
            latitude,
            longitude,
            altitude,
            accuracy,
            speed,
            heading,
        } = location.coords

        // accuracy check — reject if this reading itself is too unreliable
        if (accuracy == null || accuracy > 25) {
            logger.warn("GPS", "Poor Accuracy")
            return {
                valid: false,
                reason: "Rejected: Poor Accuracy"
            }
        }

        // calculate distance from the last saved point
        const distance = coordinateDistance({
            lat1: previousLocation.latitude,
            lon1: previousLocation.longitude,
            lat2: latitude,
            lon2: longitude
        })

        // ---- NEW: scaled minimum-movement check ----
        // Instead of one fixed number for everyone, the bar scales with
        // how accurate these two readings are. Good GPS → trust small
        // movements. Noisy GPS → require more movement before trusting it.
        const previousAccuracy = previousLocation.accuracy ?? accuracy
        const averageAccuracy = (previousAccuracy + accuracy) / 2

        const MIN_DISTANCE_FLOOR = 1    
        const ACCURACY_SCALE_FACTOR = 0.5

        const minimumMeaningfulDistance = Math.max(
            MIN_DISTANCE_FLOOR,
            averageAccuracy * ACCURACY_SCALE_FACTOR
        )

        if (distance < minimumMeaningfulDistance) {
            logger.info("GPS", "Skipped: movement too small relative to GPS accuracy", {
                distance,
                minimumMeaningfulDistance,
                averageAccuracy
            })
            return {
                valid: false,
                skip: true,
                reason: "Skipped: distance below meaningful threshold"
            }
        }
        // ---- end new check ----

        // check if timestamp is valid
        const previousTimestamp = new Date(previousLocation.timestamp).getTime()
        const currentTimestamp = location.timestamp
        const timeDifference = (currentTimestamp - previousTimestamp) / 1000

        if (timeDifference <= 0) {
            logger.warn("GPS", "Rejected: Invalid Timestamp")
            return {
                valid: false,
                reason: "Rejected: Invalid Timestamp"
            }
        }

        const driftFromCurrentTime = Math.abs(Date.now() - currentTimestamp) / 1000

        if (driftFromCurrentTime > 60) {
            logger.warn("GPS", "Rejected: Timestamp too far from current Time")
            return {
                valid: false,
                reason: "Rejected: Timestamp too far from current Time"
            }
        }

        // distance vs. realistic speed, with slack for GPS fuzziness
        const MAX_SPEED_MPS = 12
        const allowedSlack = previousAccuracy + accuracy
        const maxPlausibleDistance = (timeDifference * MAX_SPEED_MPS) + allowedSlack

        if (distance > maxPlausibleDistance) {
            logger.error("GPS", "Rejected: Distance not valid", { distance, maxPlausibleDistance })
            return {
                valid: false,
                reason: "Rejected: Distance not valid"
            }
        }

        return {
            valid: true,
            reason: null
        }

    }
    catch (error) {
        console.log("Something went wrong: ", error)
        return {
            valid: false,
            reason: "Something went wrong"
        }
    }
}