import { useAuth } from "@/context/AuthContext";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
    const { user } = useAuth();
    return (
        <SafeAreaView>
            <View>
                <Text>Profile</Text>
            </View>
        </SafeAreaView>
    )
}