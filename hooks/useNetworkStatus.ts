import { networkStatus } from "@/services/networkService"
import { useEffect } from "react"

export default function useNetworkStatus(){
    useEffect(() => {
        const networkService = networkStatus()

        return () => networkService()
    },[])
}