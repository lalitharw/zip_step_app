import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { initDatabase } from "@/database/initDatabase";
import { setUpNotificationChannel } from "@/services/notificationService";
import tamaguiConfig from "@/tamagui.config";
import { toastConfig } from "@/utils/toast";
import { DatadogProvider } from "@datadog/mobile-react-native";
import {DdRumReactNavigationTracking } from "@datadog/mobile-react-navigation"
import '@tamagui/native/setup-expo-linear-gradient';
import { Stack, useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { TamaguiProvider } from "tamagui";
import { dataDogConfig } from "../datadogRUM-init";

SplashScreen.setOptions({
  duration: 500,
  fade: true
});

export default function RootLayout() {

  const navigationRef = useNavigationContainerRef()

  useEffect(() => {
    initDatabase()
    setUpNotificationChannel()
  }, [])


  useEffect(() => {
    if(navigationRef){
      DdRumReactNavigationTracking.startTrackingViews(navigationRef)
    }
  },[navigationRef])


  return (

    <SafeAreaProvider>

      <TamaguiProvider config={tamaguiConfig} defaultTheme="default">
        <ThemeProvider>
          <DatadogProvider configuration={dataDogConfig}>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <Toast config={toastConfig} />
            </AuthProvider>
          </DatadogProvider>
        </ThemeProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
