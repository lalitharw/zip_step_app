import { useLocationStore } from "@/store/locationStore"
import { useEffect } from "react"
import ConnectivityManager from "react-native-connectivity-status"

export const useIfGpsServiceIsDisabled = () => {
    
    useEffect(() => {
        const connectivityStatusSubscription = ConnectivityManager.addStatusListener(({ eventType, status }: { eventType: string; status: boolean }) => {
            if (eventType === "location" && useLocationStore.getState().isRecording) {
                useLocationStore.getState().setIsGpsOff(!status)
            }
        })

        return () => {
            connectivityStatusSubscription.remove()
        }
    }, [])

}
