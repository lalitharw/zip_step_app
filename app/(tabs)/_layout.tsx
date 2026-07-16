import { useAuth } from "@/context/AuthContext"
import { Redirect, Tabs } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function TabLayout() {
    const { user, isLoading } = useAuth()

    if (isLoading) return null

    if (!user) {
        return <Redirect href={"/(auth)/login"} />
    }
    return (
        <SafeAreaProvider>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="index" options={{
                    title: "Home"
                }} />
                <Tabs.Screen name="history" />
                <Tabs.Screen name="profile" options={{
                    title:"You"
                }} />
            </Tabs>
        </SafeAreaProvider>
    )
}