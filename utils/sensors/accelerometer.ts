import { Accelerometer } from "expo-sensors";
import { fileLog } from "../logging/fileLogger";
import logger from "../logging/logger";
import { motionDectector } from "./motionDection";

export const subscribeAccelerometer = () => {
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {

        const magnitude = Math.sqrt(x * x + y * y + z * z)
        const movement = Math.abs(magnitude - 1)
        const isMoving = motionDectector.update(movement)
        
        logger.info(
            "ACCELEROMETER",
            "Reading",
            `${x}:${y}:${z}, moving: ${isMoving}`

        );


        fileLog("Reading", `x:${x},y:${y},z:${z}, movement:${movement},moving: ${isMoving}`)
    });

    return subscription;
};