export const calculateTimeDifference = (currentTimeStamp:number, previousTimestamp:number) => {
    return (currentTimeStamp - previousTimestamp) / 1000
}