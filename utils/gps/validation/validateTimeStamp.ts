type timestamps = {
    previousTimeStamp: number | string | Date,
    currentTimeStamp: number | string | Date,
}

export const validateTimeStamp = ({previousTimeStamp, currentTimeStamp}:timestamps) => {
    return currentTimeStamp > previousTimeStamp
}