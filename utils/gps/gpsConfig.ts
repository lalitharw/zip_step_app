export const MAX_ACCURACY_M = 25
export const MAX_FIRST_POINT_ACCURACY_M = 20

export const DEFAULT_MAX_SPEED = 12

export const MAX_SPEED_BY_ACTIVITY: Record<string,number> = {
    walk: 4, // 14 km/h
    run: 12, // 43 km/h
    cycle: 25 // 90 km/h
}

export const ELEVATION_THRESHOLD = 2