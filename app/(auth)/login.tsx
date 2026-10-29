import GradientBackground from "@/components/GradientBackground";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { Button, Image, Overlay, Spinner, Text, View, XStack, YStack } from "tamagui";



export default function Login() {

    const { googleLogin } = useAuth();
    const {theme} = useTheme();


    const [googleLoading, setGoogleLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null)





    async function handleGoogleLogin() {
        try {
            Keyboard.dismiss()
            setLoginError(null);
            setGoogleLoading(true);

            await googleLogin();

            router.replace("/(tabs)");
        } catch (error: any) {
            Toast.show({
                type: "error",
                position: "bottom",
                text2: error
            })

        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
            >


                <YStack paddingHorizontal={25} flex={1}
                    justifyContent="center"
                    gap="$5"
                    maxWidth={500}
                    width="100%"
                    alignItems="center"
                >
                    <XStack paddingHorizontal={8} paddingVertical={4}>
                        <Text fontSize={"$8"} textAlign="center" fontWeight={500} color={theme.text}>Sign Up or log in to start exploring</Text>
                    </XStack>

                    <Button
                        onPress={handleGoogleLogin}
                        width="100%"
                        height={52}
                        backgroundColor={theme.buttonPrimary}
                        borderRadius="$4"
                        borderWidth={0}
                        disabled={googleLoading}
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
                            {googleLoading ? (
                                <Spinner
                                    size="small"
                                    color="#111"
                                />
                            ) : (
                                <XStack
                                    alignItems="center"
                                    gap={10}
                                >
                                    <Image width={15} height={15} src={require("../../assets/icons/google.png")} />

                                    <Text color={theme.buttonPrimaryText} fontWeight={"bold"}>
                                        Continue with Google
                                    </Text>
                                </XStack>
                            )}
                        </XStack>
                    </Button>



                    <XStack
                        alignItems="center"
                        gap="$3"
                        marginVertical={"$1"}
                        opacity={0.5}
                    >
                        <YStack
                            flex={1}
                            height={1}
                            backgroundColor="#edede93e"
                        />

                        <Text
                            color={theme.text}
                            fontSize="$4"
                        >
                            or
                        </Text>

                        <YStack
                            flex={1}
                            height={1}
                            backgroundColor={theme.separator}
                        />
                    </XStack>

                    <Button
                        borderRadius="$4"
                        width="100%"
                        height={52}
                        onPress={() => router.push("/(auth)/emailForm")}
                        backgroundColor={"#edede9"}
                        opacity={1}
                        pressStyle={{
                            scale: 0.98,
                            opacity: 0.9,
                        }}
                    >

                        <Text
                            color={"#111"}

                            fontWeight="bold"
                        >
                            Continue with email
                        </Text>

                    </Button>



                    <View>
                        <Text fontSize={11} textAlign="center" color={theme.secondaryText}>By continuing to use StrideFlow, you agree to our Terms of Service and Privacy Policy. Personal data added to StrideFlow is public by default refer to our </Text>
                    </View>
                </YStack>




            </KeyboardAvoidingView>

            {(googleLoading) && <Overlay />}

            {/* <ErrorModal
                visible={!!loginError}
                message={loginError ?? ""}
                onClose={() => setLoginError(null)}
            /> */}
        </GradientBackground>
    );
}