import { Barometer } from "expo-sensors";

let barometerSubscription: ReturnType<typeof Barometer.addListener> | null = null
let latestRelativeAltitude: number | undefined = undefined
export const subscribeBarometer = () => {
    if (barometerSubscription) return

    Barometer.setUpdateInterval(100)

    barometerSubscription = Barometer.addListener(({ pressure, relativeAltitude }) => {
        if (relativeAltitude !== undefined) {
            latestRelativeAltitude = relativeAltitude
        }
    })
}

export const stopBarometer = () => {
    barometerSubscription?.remove()
    barometerSubscription = null
    latestRelativeAltitude = undefined
}

export const getLatestRelativeLatitude = () => {
    return latestRelativeAltitude
}

export const hasBarometer = async () => {
    return Barometer.isAvailableAsync()
}