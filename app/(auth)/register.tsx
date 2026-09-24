import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, H4, Spinner, Text, XStack, YStack } from "tamagui";

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { register } = useAuth()



    async function handleRegister() {
        if (!name || !email || !password) {
            Alert.alert("Missing Fields", "All the fields are required")
            return
        }
        try {
            setIsLoading(true)
            await register(email, password, name)
            router.push("/(tabs)")
        }
        catch (err) {
        }
        finally {
            setIsLoading(false)
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
                        {/* Header */}
                        <YStack
                            alignItems="center"
                            gap="$2"
                            marginBottom="$2"
                        >
                            <H4
                                fontSize={34}
                                textAlign="center"
                                color="#edede9"
                                fontWeight="600"
                                letterSpacing={-0.8}
                            >
                                Create your account
                            </H4>

                            <Text
                                textAlign="center"
                                color="#edede9"
                                opacity={0.55}
                                fontSize="$3"
                            >
                                Start your journey with StrideFlow
                            </Text>
                        </YStack>

                        {/* Form Card */}
                        <YStack
                            backgroundColor="rgba(255,255,255,0.06)"
                            borderWidth={1}
                            borderColor="rgba(255,255,255,0.10)"
                            borderRadius="$6"
                            padding="$4"
                            gap="$4"
                        >
                            {/* Name */}
                            <InputComponent
                                name="Name*"
                                value={name}
                                setValue={setName}
                                placeholder="Alex Smith"
                                extraOptions={{
                                    autoCapitalize: "words",
                                    autoCorrect: false,
                                    returnKeyType: "next",
                                }}
                            />

                            {/* Email */}
                            <InputComponent
                                name="Email*"
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

                            {/* Password */}
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

                            {/* Password hint */}
                            <XStack
                                alignItems="center"
                                gap="$2"
                                marginTop={-8}
                                opacity={0.45}
                            >
                                <Text
                                    color="#edede9"
                                    fontSize="$2"
                                >
                                    Use at least 8 characters for your password
                                </Text>
                            </XStack>

                            {/* Register */}
                            <Button
                                onPress={handleRegister}
                                width="100%"
                                height={52}
                                borderRadius="$4"
                                backgroundColor="#edede9"
                                disabled={isLoading}
                                pressStyle={{
                                    scale: 0.98,
                                    opacity: 0.9,
                                }}
                            >
                                {isLoading ? (
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
                                        Create Account
                                    </Text>
                                )}
                            </Button>
                        </YStack>

                        {/* Terms */}
                        <Text
                            textAlign="center"
                            color="#edede9"
                            opacity={0.4}
                            fontSize="$1"
                            paddingHorizontal="$4"
                        >
                            By creating an account, you agree to our Terms
                            and Privacy Policy.
                        </Text>
                    </YStack>
                </ScrollView>

                {/* Footer */}
                <XStack
                    justifyContent="center"
                    alignItems="center"
                    paddingTop="$3"
                    paddingBottom="$6"
                >
                    <Text
                        color="#edede9"
                        opacity={0.55}
                    >
                        Already have an account?
                    </Text>

                    <Text
                        onPress={() => router.push("/(auth)/login")}
                        fontWeight="800"
                        color="#edede9"
                        marginLeft="$1"
                        pressStyle={{
                            opacity: 0.5,
                        }}
                    >
                        Sign In
                    </Text>
                </XStack>
            </KeyboardAvoidingView>
        </GradientBackground>
    )
}