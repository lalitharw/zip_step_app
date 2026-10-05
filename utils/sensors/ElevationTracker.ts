import logger from "../logging/logger"
import { motionDectector } from "./motionDetector"

class ElevationTracker {
    private previousAltitude: number | null = null
    private gain = 0
    private loss = 0
    private readonly THRESHOLD = 2

    update(relativeAltitude: number | null) {
        if (relativeAltitude == null || !Number.isFinite(relativeAltitude)) {
            return
        }

        if (!motionDectector.isMoving) {
            return
        }

        if (this.previousAltitude === null) {
            this.previousAltitude = relativeAltitude
            return
        }

        const difference = relativeAltitude - this.previousAltitude

        if (difference >= this.THRESHOLD) {
            this.gain += difference
            this.previousAltitude = relativeAltitude
        }

        if (difference <= -this.THRESHOLD) {
            this.loss += Math.abs(difference)
            this.previousAltitude = relativeAltitude
        }

        logger.info("Barometer",`Loss: ${this.loss}, Gain:${this.gain}`)
    }

    getStats() {
        return {
            elevationGain: this.gain,
            elevationLoss: this.loss,
            currentElevation: this.previousAltitude
        }
    }

    reset() {
        this.previousAltitude = null
        this.gain = 0
        this.loss = 0
    }
}


export const elevationTracker = new ElevationTracker()