import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, H4, Spinner, Text, XStack, YStack } from "tamagui";

export default function Login() {
    const { login, googleLogin } = useAuth();
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
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    async function handleGoogleLogin() {
        try {
            await googleLogin()
            router.replace("/(tabs)")
        }
        catch (error) {

        }
    }

    return (


        <GradientBackground>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 20,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <YStack
                        flex={1}
                        justifyContent="center"
                        gap="$5"
                        maxWidth={500}
                        width="100%"
                        alignSelf="center"
                    >
                        <YStack
                            gap="$2"
                            alignItems="center"
                            marginBottom="$2"
                        >
                            <H4
                                fontSize={36}
                                color="#edede9"
                                fontWeight="600"
                                letterSpacing={-1}
                            >
                                Welcome Back
                            </H4>

                            <Text
                                color="#edede9"
                                opacity={0.55}
                                fontSize="$3"
                            >
                                Sign in to continue your journey
                            </Text>
                        </YStack>

                        <YStack
                            backgroundColor="rgba(255,255,255,0.06)"
                            borderWidth={1}
                            borderColor="rgba(255,255,255,0.10)"
                            borderRadius="$6"
                            padding="$4"
                            gap="$4"
                        >

                            <Button
                                onPress={() => handleGoogleLogin()}
                                width="100%"
                                height={52}
                                backgroundColor="white"
                                borderRadius="$4"
                                borderWidth={0}
                                pressStyle={{
                                    scale: 0.98,
                                    opacity: 0.9,
                                }}
                            >
                                <XStack
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="$2"
                                    width="100%"
                                >
                                    <Text
                                        color="#111"
                                        fontSize="$4"
                                        fontWeight="600"
                                    >
                                        G
                                    </Text>

                                    <Text
                                        color="#111"
                                        fontSize="$3"
                                        fontWeight="600"
                                    >
                                        Continue with Google
                                    </Text>
                                </XStack>
                            </Button>

                            <XStack
                                alignItems="center"
                                gap="$3"
                                opacity={0.5}
                            >
                                <YStack
                                    flex={1}
                                    height={1}
                                    backgroundColor="#edede9"
                                />

                                <Text
                                    color="#edede9"
                                    fontSize="$2"
                                >
                                    or continue with email
                                </Text>

                                <YStack
                                    flex={1}
                                    height={1}
                                    backgroundColor="#edede9"
                                />
                            </XStack>

                            <YStack gap="$3">
                                <InputComponent
                                    name="Email Address*"
                                    value={email}
                                    setValue={setEmail}
                                    placeholder="example@gmail.com"
                                    extraOptions={{
                                        keyboardType: "email-address",
                                        autoCapitalize: "none",
                                        autoCorrect: false,
                                        returnKeyType: "next",
                                    }}
                                />

                                <InputComponent
                                    name="Password*"
                                    value={password}
                                    setValue={setPassword}
                                    placeholder="••••••••"
                                    extraOptions={{
                                        secureTextEntry: true,
                                        returnKeyType: "done",
                                    }}
                                />
                            </YStack>

                            {/* Forgot password */}
                            <XStack
                                justifyContent="flex-end"
                                width="100%"
                            >
                                <Text
                                    onPress={() =>
                                        router.push("/(auth)/forgoutPassword")
                                    }
                                    fontSize="$2"
                                    color="#edede9"
                                    opacity={0.8}
                                    pressStyle={{
                                        opacity: 0.5,
                                    }}
                                >
                                    Forgot Password?
                                </Text>
                            </XStack>

                            {/* Sign In */}
                            <Button
                                borderRadius="$4"
                                width="100%"
                                height={52}
                                onPress={handleLogin}
                                disabled={loading}
                                backgroundColor="#edede9"
                                pressStyle={{
                                    scale: 0.98,
                                    opacity: 0.9,
                                }}
                            >
                                {loading ? (
                                    <Spinner
                                        size="small"
                                        color="#111"
                                    />
                                ) : (
                                    <Text
                                        color="#111"
                                        fontSize="$3"
                                        fontWeight="700"
                                    >
                                        Sign In
                                    </Text>
                                )}
                            </Button>
                        </YStack>

                        <XStack
                            justifyContent="center"
                            alignItems="center"
                            gap="$2"
                            opacity={0.45}
                        >
                            <Text
                                color="#edede9"
                                fontSize="$2"
                            >
                                🔒
                            </Text>

                            <Text
                                color="#edede9"
                                fontSize="$2"
                            >
                                Your account is secure with us
                            </Text>
                        </XStack>
                    </YStack>
                </ScrollView>

                <XStack
                    justifyContent="center"
                    alignItems="center"
                    paddingBottom="$6"
                    paddingTop="$3"
                >
                    <Text
                        color="#edede9"
                        opacity={0.55}
                    >
                        Don't have an account?
                    </Text>

                    <Text
                        onPress={() => router.push("/(auth)/register")}
                        fontWeight="800"
                        color="#edede9"
                        marginLeft="$1"
                        pressStyle={{
                            opacity: 0.5,
                        }}
                    >
                        Sign Up
                    </Text>
                </XStack>
            </KeyboardAvoidingView>
        </GradientBackground>

    )
}