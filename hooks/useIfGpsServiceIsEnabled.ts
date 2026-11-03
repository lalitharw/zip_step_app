import { useEffect } from "react"
import { useLocationStore } from "@/store/locationStore"
import ConnectivityManager from "react-native-connectivity-status"
import logger from "@/utils/logging/logger"

export const useIfGpsServiceIsDisabled = () => {
    useEffect(() => {
    const connectivityStatusSubscription  = ConnectivityManager.addStatusListener(({eventType, status}: { eventType: string; status: boolean }) => {
            if(eventType === "location"){
                logger.info("GPS status","",!status)
                useLocationStore.getState().setIsGpsOff(!status)
            }
       })
        
       return () => {
        connectivityStatusSubscription.remove()
       }
    },[])

}
