import { Redirect, Tabs } from "expo-router"
import { useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function TabLayout() {
    const [user, setUser] = useState(false)

    if (user) {
        return <Redirect href={"/(auth)/login"} />
    }
    return (
        <SafeAreaProvider>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="index" options={{
                    title: "Home"
                }} />
                <Tabs.Screen name="profile" />
            </Tabs>
        </SafeAreaProvider>
    )
}