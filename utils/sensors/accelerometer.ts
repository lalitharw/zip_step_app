import { Accelerometer } from "expo-sensors";
import { motionDectector } from "./motionDetector";
import logger from "../logging/logger";

let accelometerSubscription: ReturnType<typeof Accelerometer.addListener> | null = null

export const subscribeAccelerometer = () => {

    if (accelometerSubscription) return

    Accelerometer.setUpdateInterval(100);

    accelometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z)
        const movement = Math.abs(magnitude - 1)
        motionDectector.update(movement)
    });


};


export const stopAccelerometer = () => {
    accelometerSubscription?.remove()
    accelometerSubscription = null
}