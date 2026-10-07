import * as yup from "yup";

import { forgotPasswordAuth } from "@/api/authenticationApi";
import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";

import { router } from "expo-router";
import { useState } from "react";

import SuccessModal from "@/components/modals/SuccessModal";
import Toast from "react-native-toast-message";
import { Keyboard } from "react-native";
import { Button, H4, Spinner, Text, XStack, YStack } from "tamagui";

const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .required("Email is required")
        .email("Enter a valid email"),
});

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errors, setErrors] = useState<{
        email?: string;
    }>({});

    const handleForgotPassword = async () => {
        try {
            Keyboard.dismiss()
            await forgotPasswordSchema.validate(
                {
                    email,
                },
                {
                    abortEarly: false,
                }
            );

            setLoading(true)

            setErrors({});

            const res = await forgotPasswordAuth(email);

            if (res.success === true) {
                setEmail("")
                setSuccessMessage(res.message)
            }


        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: {
                    email?: string;
                } = {};

                error.inner.forEach((item) => {
                    if (item.path === "email") {
                        newErrors.email = item.message;
                    }
                });

                setErrors(newErrors);
            }
            else {
                Toast.show({
                    type:"error"
                })
                // AlertDialog({ title: "Error", description: "Something went wrong! Try Again Later", type: "error" })
            }
        }
        finally {
            // setEmail("")
            setLoading(false)
        }
    };

    return (
        <GradientBackground>
            <YStack
                flex={1}
                justifyContent="center"
                padding="$4"
                gap="$5"
            >
                <YStack
                    gap="$4"
                    backgroundColor="rgba(255,255,255,0.06)"
                    borderWidth={1}
                    borderColor="rgba(255,255,255,0.10)"
                    borderRadius="$6"
                    padding="$4"
                >
                    <YStack
                        gap="$2"
                        alignItems="center"
                        paddingHorizontal={15}
                    >
                        <H4
                            fontSize={28}
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

                    <InputComponent
                        name="Email"
                        value={email}
                        setValue={setEmail}
                        error={errors.email}
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
                        backgroundColor="#edede9"
                        pressStyle={{
                            scale: 0.98,
                            opacity: 0.9,
                        }}
                        onPress={handleForgotPassword}
                    >
                        <Text
                            color="#111"
                            fontSize="$3"
                            fontWeight="700"
                        >
                            {
                                loading ? <Spinner
                                    size="small"
                                    color="#111"
                                /> : "Send Code"
                            }
                        </Text>
                    </Button>

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
            </YStack>

            <SuccessModal visible={!!successMessage} message={successMessage ?? ""} onClose={() => {
                setSuccessMessage(null)
                router.replace("/(auth)/login")
            }} />


        </GradientBackground>
    );
}