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
    timestamp: string | number | Date;
};

type validateLocationPointReturnType = {
    valid: boolean,
    reason: string | null
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

        //calculate distance
        const distance = coordinateDistance({
            lat1: previousLocation.latitude,
            lon1: previousLocation.longitude,
            lat2: latitude,
            lon2: longitude
        })


        // accuracy check
        if (accuracy == null || accuracy > 10) {
            logger.warn("GPS", "Poor Accuracy")
            return {
                valid: false,
                reason: "Rejected: Poor Accuracy"
            }
        }

        //check if timestamp is valid
        const previousTimestamp = new Date(previousLocation.timestamp).getTime()
        const currentTimestamp = location.timestamp
        let timeDifference: number | null = null
        timeDifference = (currentTimestamp - previousTimestamp) / 1000

        if (timeDifference <= 0) {
            console.log("Rejected: Invalid Timestamp")
            return {
                valid: false,
                reason: "Rejected: Invalid Timestamp"
            }
        }

        const driftFromCurrentTime = Math.abs(Date.now() - currentTimestamp) / 1000

        if (driftFromCurrentTime > 60) {
            console.log("Rejected: Timestamp too far from current Time")
            return {
                valid: false,
                reason: "Rejected: Timestamp too far from current Time"
            }
        }

        // check if distance is valid
        if (distance > 100) {
            console.log("Rejected: Distance is more than 100m")
            return {
                valid: false,
                reason: "Rejected: Distance is more than 100m"
            }
        }

        if (timeDifference !== null) {
            const calCulateSpeed = distance / timeDifference
            if (calCulateSpeed > 12) {
                console.log("Rejected: Unrealistic Speed")
                return {
                    valid: false,
                    reason: "Rejected: Unrealistic Speed"
                }
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