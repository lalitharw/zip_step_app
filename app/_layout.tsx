import { AuthProvider } from "@/context/AuthContext";
import tamaguiConfig from "@/tamagui.config";
import '@tamagui/native/setup-expo-linear-gradient';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { TamaguiProvider } from "tamagui";


export default function RootLayout() {
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
