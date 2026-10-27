import { useEffect } from "react"
import { useLocationStore } from "@/store/locationStore"
import ConnectivityManager from "react-native-connectivity-status"

export const useIfGpsServiceIsDisabled = () => {
    const locationStore = useLocationStore.getState()
    useEffect(() => {
    const connectivityStatusSubscription  = ConnectivityManager.addStatusListener(({eventType, status}: { eventType: string; status: boolean }) => {
            if(eventType === "location"){
                locationStore.setIsGpsOff(status)
            }
       })
        
       return () => {
        connectivityStatusSubscription.remove()
       }
    },[])

}
