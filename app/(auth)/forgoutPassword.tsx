import GradientBackground from "@/components/GradientBackground"
import InputComponent from "@/components/Input"
import { useState } from "react"
import { Button, H4, Text, View, YStack } from "tamagui"

export default function forgotPassword() {
    const [email, setEmail] = useState("")
    return (
        <GradientBackground>
            <YStack flex={1} justifyContent="center" padding={"$4"} gap={"$4"}>
                <YStack gap={"$2"} alignItems="center" paddingHorizontal={10}>
                    <H4 fontSize={35} paddingVertical={10} color={"#e9eaed"}>Forgot Password?</H4>
                    <Text textAlign="center" color={"#edede967"}>Enter your email and we'll send a 5-digit verification code instantly</Text>
                </YStack>

                <YStack gap={"$2"}>
                    <View>
                        <InputComponent name="Email Address*"
                            value={email}
                            setValue={setEmail}
                            placeholder="example@gmail.com"
                            extraOptions={{
                                KeyboardType: "email-address"
                            }}
                        />
                    </View>
                </YStack>
                <Button borderRadius={"$10"} width={"100%"}>
                    Send Code
                </Button>
            </YStack>
        </GradientBackground >
    )
}