import { colors } from "@/constants/theme";
import { useReplayRouteStore } from "@/store/ReplayRouteStore";
import { PlayIcon, StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CameraRef } from "@maplibre/maplibre-react-native";
import React from "react";
import { Button } from "tamagui";

type replayRouteButtonProp = {
    cameraRef: React.RefObject<CameraRef | null>
}

export default function ReplayRouteButton({ cameraRef }: replayRouteButtonProp) {

    const setIsReplaying = useReplayRouteStore((state) => state.setIsReplaying)
    const setReplayCoordinates = useReplayRouteStore((state) => state.addReplayRoute)
    const clearReplayRoute = useReplayRouteStore((state) => state.clearReplayRoute)
    const locationPoints = useReplayRouteStore((state) => state.locationPoints)
    const isReplaying = useReplayRouteStore((state) => state.isReplaying)

    const replayRoute = async () => {
        try {
            if (locationPoints.length < 2) return
            setIsReplaying(true)
            clearReplayRoute()
            for (let i = 0; i < locationPoints.length; i++) {
                const coordinate: [number, number] = [
                    locationPoints[i].longitude,
                    locationPoints[i].latitude
                ]
                setReplayCoordinates(coordinate)
                cameraRef.current?.easeTo({
                    center: coordinate,
                    duration: 500
                })
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        }
        catch (error) {

        }
        finally {
            setIsReplaying(false)
            clearReplayRoute()
        }
    }

    const stopReplayRoute = async () => {
        setIsReplaying(false)
        clearReplayRoute()
    }

    return (
        <>
            {
                isReplaying ? (
                    <Button onPress={() => stopReplayRoute()} width={40} height={40} borderRadius={"50%"} backgroundColor={colors.primaryWhite}>
                        <HugeiconsIcon
                            icon={StopIcon}
                        />
                    </Button >
                ) : (
                    <Button onPress={() => replayRoute()} width={40} height={40} borderRadius={"50%"} backgroundColor={colors.primaryWhite}>
                        <HugeiconsIcon
                            icon={PlayIcon}
                        />
                    </Button >

                )
            }

        </>
    )
}

