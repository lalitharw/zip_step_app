import GradientBackground from "@/components/GradientBackground"
import MapBox from "@/components/MapBox"
import ActivityStats from "@/components/stats/ActivityStats"
import Timer from "@/components/Timer"
import { useLocationStore } from "@/store/locationStore"
import Animated, { LinearTransition } from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"
export default function index() {
    const isRecording = useLocationStore((state) => state.isRecording)
    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                {
                    isRecording &&
                    <Animated.View layout={LinearTransition.springify()}
                    >
                        <Timer />
                    </Animated.View>
                }
                <MapBox />

                <ActivityStats/>

            </SafeAreaView>
        </GradientBackground>
    )
}