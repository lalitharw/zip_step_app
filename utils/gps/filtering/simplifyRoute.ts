// type KalmanState = {
//     x: number;
//     y: number;
//     variance: number;
//     timestamp: number;
// };

// export class KalmanFilter {
//     private state: KalmanState | null = null;

//     private readonly processNoise: number;

//     private originLatitude: number | null = null;
//     private originLongitude: number | null = null;

//     constructor(processNoisePerSecond = 3) {
//         this.processNoise = processNoisePerSecond;
//     }

//     public update(
//         latitude: number,
//         longitude: number,
//         accuracy: number,
//         timestampMs: number
//     ): {
//         latitude: number;
//         longitude: number;
//     } {
//         /*
//          * First GPS point becomes our local coordinate origin.
//          */
//         if (
//             this.originLatitude === null ||
//             this.originLongitude === null
//         ) {
//             this.originLatitude = latitude;
//             this.originLongitude = longitude;
//         }

//         const { x, y } = this.toLocalMeters(
//             latitude,
//             longitude
//         );

//         /*
//          * First point initializes the Kalman state.
//          */
//         if (!this.state) {
//             this.state = {
//                 x,
//                 y,
//                 variance: accuracy * accuracy,
//                 timestamp: timestampMs,
//             };

//             return {
//                 latitude,
//                 longitude,
//             };
//         }

//         const elapsedSeconds = Math.max(
//             0,
//             (timestampMs - this.state.timestamp) / 1000
//         );

//         /*
//          * Prediction
//          */
//         const predictedVariance =
//             this.state.variance +
//             elapsedSeconds *
//                 this.processNoise *
//                 this.processNoise;

//         /*
//          * Measurement uncertainty.
//          *
//          * Accuracy is already expressed in meters,
//          * so this is now compatible with x/y.
//          */
//         const measurementVariance =
//             accuracy * accuracy;

//         /*
//          * Kalman gain
//          */
//         const kalmanGain =
//             predictedVariance /
//             (predictedVariance + measurementVariance);

//         /*
//          * Update position
//          */
//         const newX =
//             this.state.x +
//             kalmanGain * (x - this.state.x);

//         const newY =
//             this.state.y +
//             kalmanGain * (y - this.state.y);

//         /*
//          * Update uncertainty
//          */
//         const newVariance =
//             (1 - kalmanGain) * predictedVariance;

//         this.state = {
//             x: newX,
//             y: newY,
//             variance: newVariance,
//             timestamp: timestampMs,
//         };

//         /*
//          * Convert meters back to GPS coordinates.
//          */
//         return this.fromLocalMeters(newX, newY);
//     }

//     public reset() {
//         this.state = null;
//         this.originLatitude = null;
//         this.originLongitude = null;
//     }

//     private toLocalMeters(
//         latitude: number,
//         longitude: number
//     ) {
//         const lat0 = this.originLatitude!;
//         const lon0 = this.originLongitude!;

//         const metersPerDegreeLatitude = 111_320;

//         const metersPerDegreeLongitude =
//             111_320 *
//             Math.cos((lat0 * Math.PI) / 180);

//         const x =
//             (longitude - lon0) *
//             metersPerDegreeLongitude;

//         const y =
//             (latitude - lat0) *
//             metersPerDegreeLatitude;

//         return { x, y };
//     }

//     private fromLocalMeters(
//         x: number,
//         y: number
//     ) {
//         const lat0 = this.originLatitude!;
//         const lon0 = this.originLongitude!;

//         const metersPerDegreeLatitude = 111_320;

//         const metersPerDegreeLongitude =
//             111_320 *
//             Math.cos((lat0 * Math.PI) / 180);

//         const latitude =
//             lat0 +
//             y / metersPerDegreeLatitude;

//         const longitude =
//             lon0 +
//             x / metersPerDegreeLongitude;

//         return {
//             latitude,
//             longitude,
//         };
//     }
// }