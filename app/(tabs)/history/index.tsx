import { Link } from "expo-router"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function index() {
    return (
        <SafeAreaView>

            <View>
                <Text>History</Text>
                <Link href={"/(tabs)/history/1"}>1</Link>
            </View>
        </SafeAreaView>
    )
}