import { colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useReplayRouteStore } from "@/store/ReplayRouteStore";
import logger from "@/utils/logging/logger";
import { PlayIcon, StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Camera } from "@rnmapbox/maps";
import React, { useEffect, useRef } from "react";
import { Button } from "tamagui";

type Coordinate = {
    latitude: number,
    longitude: number,
    heading: number
}

type replayRouteButtonProp = {
    cameraRef: React.RefObject<Camera | null>,
    locationPoints: Coordinate[]
}

export default function ReplayRouteButton({ cameraRef, locationPoints }: replayRouteButtonProp) {
    const {theme} = useTheme()
    const setIsReplaying = useReplayRouteStore((state) => state.setIsReplaying)
    const addReplayCoordinate = useReplayRouteStore((state) => state.addReplayRoute)
    const clearReplayRoute = useReplayRouteStore((state) => state.clearReplayRoute)
    const isReplaying = useReplayRouteStore((state) => state.isReplaying)

    const cancelRef = useRef(false)

    const STEP_DELAY_MS = 10
    const MAX_STEPS = 400

    useEffect(() => {
        return () => {
            cancelRef.current = true
            setIsReplaying(false)
        }
    }, [])

    const replayRoute = async () => {
        if (locationPoints.length < 2) return

        cancelRef.current = false
        setIsReplaying(true)
        clearReplayRoute()
        const step = Math.max(1, Math.ceil(locationPoints.length / MAX_STEPS))
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
                cameraRef.current?.setCamera({
                    centerCoordinate: [coordinate[0], coordinate[1]],
                    animationDuration: STEP_DELAY_MS,
                    animationMode: "easeTo",
                    zoomLevel: 17
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
                    <Button onPress={stopReplayRoute} width={40} height={40} borderRadius={"50%"} backgroundColor={theme.buttonPrimary}>
                        <HugeiconsIcon icon={StopIcon} color={theme.buttonPrimaryText} />
                    </Button>
                ) : (
                    <Button onPress={replayRoute} width={40} height={40} borderRadius={"50%"} backgroundColor={theme.buttonPrimary}>
                        <HugeiconsIcon icon={PlayIcon}  />
                    </Button>
                )
            }
        </>
    )
}