import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, H4, Spinner, Text, XStack, YStack } from "tamagui";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        if (!email || !password) {
            return
        }
        setLoading(true)
        try {
            await login(email, password)
            router.replace("/(tabs)")
        }
        catch (err: any) {
        }
        finally {
            setLoading(false)
        }
    }

    return (

        <GradientBackground>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <YStack
                        flex={1}
                        justifyContent="center"
                        padding="$4"
                        gap="$4"
                    >
                        <YStack gap="$2" paddingHorizontal={10} alignItems="center">
                            <H4 fontSize={35} marginBottom={10} color="#edede9" fontWeight="500">
                                Welcome Back!
                            </H4>

                            {/* <Text textAlign="center" color="#edede967">
                                Sign in to access smart, personalized travel plans made for you
                            </Text> */}
                        </YStack>

                        <YStack gap="$2">
                            <InputComponent
                                name="Email Address*"
                                value={email}
                                setValue={setEmail}
                                placeholder="example@gmail.com"
                                extraOptions={{
                                    keyboardType: "email-address",
                                }}
                            />

                            <InputComponent
                                name="Password*"
                                value={password}
                                setValue={setPassword}
                                placeholder="••••••••"
                                extraOptions={{
                                    secureTextEntry: true,
                                }}
                            />
                        </YStack>

                        <XStack justifyContent="flex-end" width="100%">
                            <Text onPress={() => router.push("/(auth)/forgoutPassword")} fontSize="$2" color="#edede9">
                                Forgot Password?
                            </Text>
                        </XStack>

                        <Button
                            borderRadius="$10"
                            width="100%"
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="small" color="$green10" /> : <Text>Sign In</Text>}
                        </Button>

                    </YStack>
                </ScrollView >
            </KeyboardAvoidingView>
            <XStack justifyContent="center" marginTop={"auto"} pb={"$6"}>
                <Text color={"#edede967"}>Don't have an account?</Text><Text onPress={() => router.push("/(auth)/register")} fontWeight={900} color={"#edede9"}> Sign Up</Text>
            </XStack>
        </GradientBackground >
    )
}