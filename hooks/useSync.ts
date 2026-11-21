import { networkStatus } from "@/services/networkService";
import { useEffect } from "react";

export default function useSync() {
    useEffect(() => {
        const unsubscribe = networkStatus()
        return unsubscribe
    }, [])
}