const WINDOW_SIZE = 10
const MOVEMENT_THRESHOLD = 0.08
const MOVING_REQUIRED = 5

class MotionDectector{
    private readings: number[] = []
    private moving: boolean = false

    update(movement:number): boolean {
        this.readings.push(movement)

        if(this.readings.length > WINDOW_SIZE){
            this.readings.shift()
        }

        if(this.readings.length < WINDOW_SIZE){
            return this.moving
        }

        const movingReading =  this.readings.filter(value => {
            return value >= MOVEMENT_THRESHOLD
        }).length

        this.moving = movingReading >= MOVING_REQUIRED

        // console.log(`[MOTION] movement=${movement.toFixed(3)}`,`window=${this.readings.length}`,`movingReadings=${movingReading}`,`isMoving=${this.moving}`,`readings=${this.readings.map((value) => value.toFixed(3)).join(",")}`)

        return this.moving
    }

    isMoving(): boolean {
        return this.moving
    }

    reset() {
        this.readings = []
        this.moving = false
    }
}

export const motionDectector = new MotionDectector()