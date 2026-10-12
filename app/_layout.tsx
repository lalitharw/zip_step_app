import { AuthProvider } from "@/context/AuthContext";
import { initDatabase } from "@/database/initDatabase";
import { setUpNotificationChannel } from "@/services/notificationService";
import tamaguiConfig from "@/tamagui.config";
import { toastConfig } from "@/utils/toast";
import '@tamagui/native/setup-expo-linear-gradient';
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { TamaguiProvider } from "tamagui";

export default function RootLayout() {

  SplashScreen.setOptions({
    duration: 500,
    fade: true
  });

  useEffect(() => {
    initDatabase()
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
          <Toast config={toastConfig} />
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
