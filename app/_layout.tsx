import { AuthProvider } from "@/context/AuthContext";
import tamaguiConfig from "@/tamagui.config";
import '@tamagui/native/setup-expo-linear-gradient';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
        </AuthProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
