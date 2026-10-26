import GradientBackground from "@/components/GradientBackground"
import MapBoxNew from "@/components/maps/MapboxNew"
import { useActivityTimerNew } from "@/hooks/useActivityTimerNew"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useLocationStore } from "@/store/locationStore"
import { View } from "tamagui"
export default function index() {
    const isRecording = useLocationStore((state) => state.isRecording)
    const isPaused = useActivityPauseStore((state) => state.isActivityPaused)
    useActivityTimerNew({isRecording,isPaused})
    return (
        <GradientBackground>
            <View style={{ flex: 1 }}>
                <MapBoxNew/>
            </View>
        </GradientBackground>
    )
}