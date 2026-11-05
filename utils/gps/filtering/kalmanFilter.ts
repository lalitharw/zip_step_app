
type kalmanState = {
    latitude: number;
    longitude: number;
    variance: number;
    timestamp: number;
};

type FilteredLocation = {
    latitude: number;
    longitude: number;
};

export class kalmanFilter {
    private state: kalmanState | null = null;

    private readonly processNoise: number;
    private readonly maxTimeGap = 10;

    constructor(processNoisePerSecond = 3) {
        this.processNoise = processNoisePerSecond;
    }

    public update(
        latitude: number,
        longitude: number,
        accuracy: number,
        timestampMs: number
    ): FilteredLocation | null {

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            !Number.isFinite(accuracy) ||
            !Number.isFinite(timestampMs) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180 ||
            accuracy <= 0
        ) {
            return null;
        }

        if (!this.state) {
            this.state = {
                latitude,
                longitude,
                variance: accuracy * accuracy,
                timestamp: timestampMs,
            };

            return {
                latitude,
                longitude,
            };
        }


        if (timestampMs <= this.state.timestamp) {
            return null;
        }


        const elapsedSeconds =
            (timestampMs - this.state.timestamp) / 1000;


        if (elapsedSeconds > this.maxTimeGap) {
            this.state = {
                latitude,
                longitude,
                variance: accuracy * accuracy,
                timestamp: timestampMs,
            };

            return {
                latitude,
                longitude,
            };
        }


        const predictedVariance =
            this.state.variance +
            elapsedSeconds *
            this.processNoise *
            this.processNoise;


        const measurementVariance = accuracy * accuracy;


        const kalmanGain =
            predictedVariance /
            (predictedVariance + measurementVariance);


        const newLat =
            this.state.latitude +
            kalmanGain * (latitude - this.state.latitude);

        const newLon =
            this.state.longitude +
            kalmanGain * (longitude - this.state.longitude);


        const newVariance =
            (1 - kalmanGain) * predictedVariance;
        this.state = {
            latitude: newLat,
            longitude: newLon,
            variance: newVariance,
            timestamp: timestampMs,
        };

        return {
            latitude: newLat,
            longitude: newLon,
        };
    }


    public reset(): void {
        this.state = null;
    }
}
