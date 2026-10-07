
import { forgotPasswordAuth } from "@/api/authenticationApi";
import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import BackButton from "@/components/buttons/BackButton";
import SuccessModal from "@/components/modals/SuccessModal";
import { colors } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import Toast from "react-native-toast-message";
import { Button, Spinner, Text, YStack } from "tamagui";



export default function ForgotPassword() {
    const { email } = useLocalSearchParams<{ email: string }>()
    const [loading, setLoading] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>("")

    const handleForgotPassword = async () => {
        try {
            setLoading(true)
            const res = await forgotPasswordAuth(email);

            if (res.success === true) {

                setSuccessMessage(res.message)
            }


        } catch (error) {
            Toast.show({
                type: "error",
                position: "bottom"
            })
        }
        finally {

            setLoading(false)
        }
    };

    return (
        <GradientBackground>
            <YStack
                paddingHorizontal={25}
                height={"80%"}
                justifyContent="center"
                gap="$3"
                maxWidth={500}
                width="100%"
                alignItems="center"
            >
                <BackButton />
                <YStack
                    paddingHorizontal={8}
                >
                    <Text
                        fontSize="$8"
                        marginBottom={"$2"}
                        textAlign="center"
                        color={colors.primaryWhite}
                    >
                        Forgot password?
                    </Text>
                    <Text

                        textAlign="center"
                        color={"#edede996"}
                    >
                        Enter your email and we'll send you a
                        link to reset your password.
                    </Text>
                </YStack>

                <InputComponent
                    name="Email"
                    isDisabled={true}
                    value={email}
                    extraOptions={{

                    }}
                />

                <Button
                    borderRadius="$4"
                    width="100%"
                    size={"$4"}
                    disabled={loading}
                    onPress={handleForgotPassword}
                    backgroundColor="#edede9"
                    opacity={1}
                    pressStyle={{
                        scale: 0.98,
                        opacity: 0.9,
                    }}
                >
                    <Text
                        color="#111"
                        fontWeight="bold"
                    >
                        {loading ? (
                            <Spinner
                                size="small"
                                color="#111"
                            />
                        ) : (
                            <Text fontWeight={"bold"}>
                                Continue
                            </Text>
                        )}
                    </Text>
                </Button>
            </YStack>

            <SuccessModal visible={!!successMessage} message={successMessage} onClose={() => router.replace("/(auth)/login")} />

        </GradientBackground >
    );
}