import { colors } from "@/constants/theme";
import { useReplayRouteStore } from "@/store/ReplayRouteStore";
import { PlayIcon, StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, { useEffect, useRef } from "react";
import { Button } from "tamagui";

type replayRouteButtonProp = {
    cameraRef: React.RefObject<CameraRef | null>
}

export default function ReplayRouteButton({ cameraRef }: replayRouteButtonProp) {

    const setIsReplaying = useReplayRouteStore((state) => state.setIsReplaying)
    const addReplayCoordinate = useReplayRouteStore((state) => state.addReplayRoute)
    const clearReplayRoute = useReplayRouteStore((state) => state.clearReplayRoute)
    const locationPoints = useReplayRouteStore((state) => state.locationPoints)
    const isReplaying = useReplayRouteStore((state) => state.isReplaying)

    const cancelRef = useRef(false)

    const STEP_DELAY_MS = 100
    const MAX_STEPS = 300

    useEffect(() => {
        return () => {
            cancelRef.current = true
        }
    }, [])

    const replayRoute = async () => {
        if (locationPoints.length < 2) return

        cancelRef.current = false
        setIsReplaying(true)
        clearReplayRoute()

        const step = Math.max(1, Math.floor(locationPoints.length / MAX_STEPS))
        const pointsToPlay = locationPoints.filter((_, i) => i % step === 0)

        try {
            for (let i = 0; i < pointsToPlay.length; i++) {
                if (cancelRef.current) break

                const coordinate: [number, number, number] = [
                    pointsToPlay[i].longitude,
                    pointsToPlay[i].latitude,
                    pointsToPlay[i].heading

                ]

                addReplayCoordinate(coordinate)
                cameraRef.current?.easeTo({
                    center: [
                        coordinate[0], coordinate[1]
                    ],
                    duration: STEP_DELAY_MS,
                })

                await new Promise(resolve => setTimeout(resolve, STEP_DELAY_MS))
            }
        }
        catch (error) {
            console.error("Replay error:", error)
        }
        finally {
            if (!cancelRef.current) {
                setIsReplaying(false)
            }
        }
    }

    const stopReplayRoute = () => {
        cancelRef.current = true
        setIsReplaying(false)
        clearReplayRoute()
    }

    return (
        <>
            {
                isReplaying ? (
                    <Button onPress={stopReplayRoute} width={40} height={40} borderRadius={"50%"} backgroundColor={colors.primaryWhite}>
                        <HugeiconsIcon icon={StopIcon} />
                    </Button>
                ) : (
                    <Button onPress={replayRoute} width={40} height={40} borderRadius={"50%"} backgroundColor={colors.primaryWhite}>
                        <HugeiconsIcon icon={PlayIcon} />
                    </Button>
                )
            }
        </>
    )
}