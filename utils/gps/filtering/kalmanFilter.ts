type kalmanState = {
    latitude: number;
    longitude: number;
    variance: number;
    timestamp: number;
}

export class kalmanFilter {
    private state: kalmanState | null = null

    private readonly processNoise: number;
    constructor(processNoisePerSecond = 3) {
        this.processNoise = processNoisePerSecond
    }

    public update(latitude: number, longitude: number, accuracy: number, timestampMs: number): { latitude: number, longitude: number } {
        if (!this.state) {
            this.state = {
                latitude,
                longitude,
                variance: accuracy * accuracy,
                timestamp: timestampMs
            }
            return { latitude, longitude }
        }

        const elapsedSeconds = Math.max(0, (timestampMs - this.state.timestamp) / 1000)

        if(elapsedSeconds > 10){
            this.state = {
                latitude,
                longitude,
                variance: accuracy * accuracy,
                timestamp: timestampMs
            }
        }

        const predictedVariance = this.state.variance + elapsedSeconds * this.processNoise * this.processNoise
        const measurementVariance = accuracy * accuracy;
        const kalmanGain = predictedVariance / (predictedVariance + measurementVariance)

        const newLat = this.state.latitude + kalmanGain * (latitude - this.state.latitude)
        const newLon = this.state.longitude + kalmanGain * (longitude - this.state.longitude);

        const newVariance = (1 - kalmanGain) * predictedVariance;

        this.state = {
            latitude: newLat,
            longitude: newLon,
            variance: newVariance,
            timestamp: timestampMs,
        };

        return { latitude: newLat, longitude: newLon };
    }

    public reset() {
        this.state = null;
    }
}