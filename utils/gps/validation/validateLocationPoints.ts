import logger from "@/utils/logging/logger";
import { motionDectector } from "@/utils/sensors/motionDetector";
import { coordinateDistance } from "../../coordinateDistance";
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
    const gpsSpeed = location.coords.speed
    const gpsMoving = gpsSpeed !== null && gpsSpeed > 0.8
    // const moving = motionDectector.isMoving() || gpsMoving
    const moving = motionDectector.isMoving()
    logger.info("Moving", "IS User Moving", moving)
    try {
        const {
            latitude,
            longitude,
            accuracy
        } = location.coords


        const previousTimestamp = new Date(previousLocation.timestamp).getTime()
        const currentTimestamp = location.timestamp
        const timeDifference = calculateTimeDifference(currentTimestamp, previousTimestamp)

        const distance = coordinateDistance({
            lat1: previousLocation.latitude,
            lon1: previousLocation.longitude,
            lat2: latitude,
            lon2: longitude
        })


        if (!validateAccuracy(accuracy ?? null)) {
            return {
                valid: false,
                reason: "Rejected: Poor Accuracy"
            }
        }


        if (!validateTimeStamp({ previousTimeStamp: previousTimestamp, currentTimeStamp: currentTimestamp })) {
            return {
                valid: false,
                reason: "Rejected: Invalid Timestamp"
            }
        }


        if (!moving) {
            if (!validateMeaningfulMovement(distance, previousLocation.accuracy ?? 0, accuracy ?? 0)) {
                return {
                    valid: false,
                    skip: true,
                    reason: "Skipped: distance below meaningful threshold"
                }
            }
        }
        // else {
        //     const floor = Math.max(1.5, (accuracy ?? 0) * 0.25)
        //     if (distance < floor) {
        //         return {
        //             valid: false,
        //             skip: true,
        //             reason: "Skipped: tiny move while moving"
        //         }
        //     }
        // }


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
        console.log("Something went wrong: ", error)
        return {
            valid: false,
            reason: "Something went wrong"
        }
    }
}