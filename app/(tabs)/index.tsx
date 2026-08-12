import GradientBackground from "@/components/GradientBackground"
import MapBox from "@/components/MapBox"
import { colors } from "@/constants/theme"
import { SafeAreaView } from "react-native-safe-area-context"
import { Text, View } from "tamagui"
export default function index() {
    return (
        <GradientBackground>
            <SafeAreaView>
                <View>
                    <Text color={colors.primaryWhite}>Index Screen Lalit</Text>
                </View>
                    <MapBox />
            </SafeAreaView>
        </GradientBackground>
    )
}