import logger from "@/utils/logging/logger";
import { motionDectector } from "@/utils/sensors/motionDetector";
import haversineDistance from "haversine-distance";
import { calculateTimeDifference } from "../calculation/calculateTimeDifference";
import { validateAccuracy } from "./validateAccuracy";
import { validateMeaningfulMovement } from "./validateMeaningfulMovement";
import { validatePlausibleDistance } from "./validatePlausibleDistance";
import { validateTimeStamp } from "./validateTimeStamp";

type LocationPointType = {
    coords: {
        latitude: number,
        longitude: number,
        altitude: number | null,
        accuracy?: number | null,
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
    skip?: boolean
}


export function validateLocationPoint(location: LocationPointType, previousLocation: PreviousLocationType, maxSpeed: number): validateLocationPointReturnType {
    try {
        const {
            latitude,
            longitude,
            accuracy
        } = location.coords

        // accuracy check
        if (!validateAccuracy(accuracy ?? null)) {
            return {
                valid: false,
                reason: "Rejected: Poor Accuracy"
            }
        }



        // validating timestamp
        const previousTimestamp = new Date(previousLocation.timestamp).getTime()
        const currentTimestamp = location.timestamp

        if (!validateTimeStamp({ previousTimeStamp: previousTimestamp, currentTimeStamp: currentTimestamp })) {
            return {
                valid: false,
                reason: "Rejected: Invalid Timestamp"
            }
        }

        const timeDifference = calculateTimeDifference(currentTimestamp, previousTimestamp)
        if (!Number.isFinite(timeDifference) || timeDifference <= 0) {
            return {
                valid: false,
                reason: "Rejected: Invalid time difference"
            }
        }


        const distance = haversineDistance(
            {
                latitude: previousLocation.latitude,
                longitude: previousLocation.longitude
            },
            {
                latitude: latitude,
                longitude: longitude
            }
        )
        if (!Number.isFinite(distance)) {
            return {
                valid: false,
                reason: "Rejected: Invalid distance"
            }
        }

        // identical coordinates: nothing new to save, whether moving or not
        if (distance === 0) {
            return {
                valid: false,
                skip: true,
                reason: "Skipped: duplicate coordinates"
            }
        }

        const moving = motionDectector.isMoving()
        logger.info("Moving", "IS User Moving", moving)

        if (!moving) {
            if (!validateMeaningfulMovement(distance, previousLocation.accuracy ?? 0, accuracy ?? 0)) {
                return {
                    valid: false,
                    skip: true,
                    reason: "Skipped: distance below meaningful threshold"
                }
            }
        }

        if (!validatePlausibleDistance(accuracy ?? 0, previousLocation.accuracy ?? 0, distance, timeDifference, maxSpeed)) {
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
        logger.error("GPS", "validateLocationPoint failed", error)
        return {
            valid: false,
            reason: "Something went wrong"
        }
    }
}