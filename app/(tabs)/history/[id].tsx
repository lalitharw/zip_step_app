import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityDetail() {
    const { id } = useLocalSearchParams()
    return (
        <SafeAreaView>
            <View>
                <Text>{id}</Text>
            </View>
        </SafeAreaView>
    )
}