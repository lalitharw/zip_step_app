import { colors } from "@/constants/theme"
import { Stack } from "expo-router"

export default function HistoryLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "History", headerStyle: { backgroundColor: colors.primaryBlack }, headerTintColor:colors.primaryWhite }} />
            {/* <Stack.Screen name="[id]"  options={{ headerShown:false, title: "Activity" }}  /> */}
        </Stack>

    )
}