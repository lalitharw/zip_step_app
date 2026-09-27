import { calculateDistance } from "../calculation/calculateDistance";
import { calculateHeadingDifference } from "../calculation/calculateHeadingDifference";
import logger from "@/utils/logging/logger";

type Coordinate = {
    longitude: number,
    latitude: number,
    heading: number
}

const MIN_DISTANCE_METERS = 5;
const MIN_HEADING_CHANGE = 20;



export function simplifyRoute(coordinates: Coordinate[]) {
    if (coordinates.length < 2) return coordinates
    const simplified: Coordinate[] = [];
    simplified.push(coordinates[0])
    let lastKeptPoint = coordinates[0]
    for (let i = 1; i < coordinates.length - 1; i++) {
        const currentPoint = coordinates[i]
        const distance = calculateDistance(lastKeptPoint, currentPoint)

        if (lastKeptPoint.heading !== null && currentPoint.heading !== null) {
            const headingDifference = calculateHeadingDifference(lastKeptPoint.heading, currentPoint.heading)

            const headingChanged = headingDifference >= MIN_HEADING_CHANGE
            const movedEnough = distance >= MIN_DISTANCE_METERS

            if (movedEnough || headingChanged) {
                simplified.push(currentPoint)
                lastKeptPoint = currentPoint
            }
        }

    }

    const lastPoint = coordinates[coordinates.length - 1]
    simplified.push(lastPoint)



    logger.info("GPS", `Route simplified: ${ coordinates.length } → ${ simplified.length } points`); 
    return simplified;

}

