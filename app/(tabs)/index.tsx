import GradientBackground from "@/components/GradientBackground"
import MapBox from "@/components/MapBox"
import { SafeAreaView } from "react-native-safe-area-context"
export default function index() {
    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <MapBox />
            </SafeAreaView>
        </GradientBackground>
    )
}