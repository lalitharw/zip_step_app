const MAX_SLACK_M = 8;

export const validatePlausibleDistance = (
    currentAccuracy: number,
    previousAccuracy: number,
    distance: number,
    timeDifferenceSec: number,
    maxSpeed: number
) => {
    if (!Number.isFinite(distance) || !Number.isFinite(timeDifferenceSec) || timeDifferenceSec <= 0) {
        return false;
    }
    const slack = Math.min(currentAccuracy + previousAccuracy, MAX_SLACK_M);
    const maxPlausible = timeDifferenceSec * maxSpeed + slack;
    return distance <= maxPlausible;
};