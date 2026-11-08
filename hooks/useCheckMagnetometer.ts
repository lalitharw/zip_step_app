import { Magnetometer } from "expo-sensors"
import { useState ,useEffect } from "react"

export const useCheckMagnetometer = () => {
    const [isAvailable,setIsAvailable] = useState<boolean>(false)
    useEffect(() => {
        const checkMagnetometer = async  () => {
            const available = await Magnetometer.isAvailableAsync()
            setIsAvailable(available)
        }

        checkMagnetometer()
    },[])

    return isAvailable
}