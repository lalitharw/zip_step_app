export type LocationPoint = {
    id: number,
    activityId: number,
    latitude: number,
    longitude: number,
    altitude: number,
    accuracy: number,
    speed: number,
    heading: number,
    timestamp: string
}


export type lastLocationPointReference = Pick<LocationPoint,"latitude" | "longitude" | "accuracy" | "timestamp">