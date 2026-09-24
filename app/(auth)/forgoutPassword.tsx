import GradientBackground from "@/components/GradientBackground"
import InputComponent from "@/components/Input"
import { router } from "expo-router"
import { useState } from "react"
import { Button, H4, Text, XStack, YStack } from "tamagui"

export default function forgotPassword() {
    const [email, setEmail] = useState("")
    return (
        <GradientBackground>
            <YStack
                flex={1}
                justifyContent="center"
                padding="$4"
                gap="$5"
            >
                <YStack
                    gap="$2"
                    alignItems="center"
                    paddingHorizontal={15}
                >
                    <H4
                        fontSize={34}
                        textAlign="center"
                        color="#e9eaed"
                        fontWeight="600"
                        letterSpacing={-0.5}
                    >
                        Forgot Password?
                    </H4>

                    <Text
                        textAlign="center"
                        color="#edede9"
                        opacity={0.55}
                        fontSize="$3"
                        lineHeight={22}
                    >
                        Enter your email and we'll send you a
                        5-digit verification code.
                    </Text>
                </YStack>

                <YStack
                    gap="$4"
                    backgroundColor="rgba(255,255,255,0.06)"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.10)"
                    borderRadius="$6"
                    padding="$4"
                >
                    <InputComponent
                        name="Email Address*"
                        value={email}
                        setValue={setEmail}
                        placeholder="example@gmail.com"
                        extraOptions={{
                            keyboardType: "email-address",
                            autoCapitalize: "none",
                            autoCorrect: false,
                            returnKeyType: "done",
                        }}
                    />

                    <Button
                        borderRadius="$4"
                        width="100%"
                        height={52}
                        backgroundColor="#edede9"
                        pressStyle={{
                            scale: 0.98,
                            opacity: 0.9,
                        }}
                    >
                        <Text
                            color="#111"
                            fontSize="$3"
                            fontWeight="700"
                        >
                            Send Code
                        </Text>
                    </Button>
                </YStack>

                <XStack
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text
                        color="#edede9"
                        opacity={0.55}
                    >
                        Remember your password?
                    </Text>

                    <Text
                        onPress={() => router.push("/(auth)/login")}
                        color="#edede9"
                        fontWeight="800"
                        marginLeft="$1"
                        pressStyle={{
                            opacity: 0.5,
                        }}
                    >
                        Sign In
                    </Text>
                </XStack>
            </YStack>
        </GradientBackground>

    )
}