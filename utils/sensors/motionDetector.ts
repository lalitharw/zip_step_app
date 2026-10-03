const WINDOW_SIZE = 10
const MOVEMENT_THRESHOLD = 0.08
const MOVING_REQUIRED = 5

class MotionDectector {
    private readings: number[] = []
    private moving: boolean = false
    private lastUpdate: number = 0
    update(movement: number): boolean {
        this.lastUpdate = Date.now()
        this.readings.push(movement)

        if (this.readings.length > WINDOW_SIZE) {
            this.readings.shift()
        }

        if (this.readings.length < WINDOW_SIZE) {
            return this.moving
        }

        const movingReading = this.readings.filter(value => {
            return value >= MOVEMENT_THRESHOLD
        }).length

        this.moving = movingReading >= MOVING_REQUIRED


        return this.moving
    }

    // if no fresh data for 2 seconds just send false or else send accordingly
    isMoving(): boolean {
        if (Date.now() - this.lastUpdate > 2000) {
            return false
        }
        return this.moving
    }

    reset() {
        this.lastUpdate = 0
        this.readings = []
        this.moving = false
    }
}

export const motionDectector = new MotionDectector()