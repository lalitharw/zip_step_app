export const validateMeaningfulMovement = (
    distance: number,
    previousAccuracy: number,
    accuracy: number
) => {
    const MIN_DISTANCE_FLOOR = 1
    const ACCURACY_SCALE_FACTOR = 0.5

    const averageAccuracy =
        (previousAccuracy + accuracy) / 2

    const minimumMeaningfulDistance = Math.max(
        MIN_DISTANCE_FLOOR,
        averageAccuracy * ACCURACY_SCALE_FACTOR
    )

    return distance >= minimumMeaningfulDistance
}