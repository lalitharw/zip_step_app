import GradientBackground from "@/components/GradientBackground"
import MapBox from "@/components/MapBox"
import { View } from "tamagui"
export default function index() {
    return (
        <GradientBackground>
            <View style={{ flex: 1 }}>
                <MapBox />
            </View>
        </GradientBackground>
    )
}