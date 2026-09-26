export const validateAccuracy = (accuracy: number |null, maxAccuracy = 25) => {
    if(accuracy == null){
        return false;
    }

    return accuracy <= maxAccuracy
}