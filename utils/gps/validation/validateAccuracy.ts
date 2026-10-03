import { MAX_ACCURACY_M } from "../gpsConfig";

export const validateAccuracy = (accuracy: number | null) => {
    if (accuracy == null) {
        return false;
    }

            return accuracy <= MAX_ACCURACY_M
}