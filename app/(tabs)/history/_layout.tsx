import { colors } from "@/constants/theme"
import { useTheme } from "@/context/ThemeContext"
import { Stack } from "expo-router"

export default function HistoryLayout() {
    const {theme} = useTheme()
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "History", headerStyle: { backgroundColor: theme.background }, headerTintColor:theme.text }} />
            <Stack.Screen name="[id]"  options={{ headerShown:false, title: "Activities" }}  />
        </Stack>

    )
}