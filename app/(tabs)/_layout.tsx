import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Home03Icon, Task01Icon, User03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Redirect, Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
    const { user, isLoading } = useAuth()
    if (isLoading) return null

    if (!user) {
        return <Redirect href={"/(auth)/login"} />
    }
    return (
        <SafeAreaProvider>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primaryWhite,
                tabBarInactiveTintColor: colors.secondaryWhite,
                tabBarStyle: {
                    borderColor: colors.primaryBlack,
                    backgroundColor: colors.primaryBlack,
                    height: 70
                }
            }}>
                <Tabs.Screen name="index" options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <HugeiconsIcon
                            icon={Home03Icon}
                            color={color}

                        />
                    ),
                }} />
                <Tabs.Screen name="history" options={{
                    title: "Activity",
                    tabBarIcon: ({ color, size }) => (
                        <HugeiconsIcon
                            icon={Task01Icon}
                            color={color}

                        />
                    ),
                }} />
                <Tabs.Screen name="profile" options={{
                    title: "You",
                    tabBarIcon: ({ color, size }) => (
                        <HugeiconsIcon
                            icon={User03Icon}
                            color={color}

                        />
                    ),
                }} />
            </Tabs>
        </SafeAreaProvider>
    )
}