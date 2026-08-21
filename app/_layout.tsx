import { AuthProvider } from "@/context/AuthContext";
import { setUpNotificationChannel } from "@/services/notificationService";
import tamaguiConfig from "@/tamagui.config";
import { getLocationPoints, initDatabase } from "@/utils/database";
import '@tamagui/native/setup-expo-linear-gradient';
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { TamaguiProvider } from "tamagui";


export default function RootLayout() {

  useEffect(() => {
    initDatabase().catch(console.error)
    setUpNotificationChannel()
  }, [])

  return (

    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <Toast />
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
