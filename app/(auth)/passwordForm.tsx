import { setPasswordAuth } from "@/api/authenticationApi";
import BackButton from "@/components/buttons/BackButton";
import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Keyboard } from "react-native";
import { Button, Overlay, Spinner, Text, View, XStack, YStack } from "tamagui";
import * as yup from "yup";

const passwordSchema = yup.object({
    password: yup.string().required("Password is required")
})

export default function passwordForm() {
    const { user } = useAuth()

    if (!user) {
        return <Redirect href={"/(auth)/login"} />
    }
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleEmail = async () => {
        try {
            Keyboard.dismiss()
            await passwordSchema.validate(
                {
                    password
                },
                {
                    abortEarly: false
                }
            )

            setError("")
            setLoading(true)

            const res = await setPasswordAuth(password)

            if (res.success === true) {
                router.replace("/(tabs)")
            }
        }

        catch (error) {
            if (error instanceof yup.ValidationError) {
                error.inner.forEach((item) => {
                    if (item.path == "password") {
                        setError(item.message)
                    }
                })
            }
        }
        finally {
            setPassword("")
            setLoading(false)
        }
    }

    return (
        <GradientBackground>
            <YStack
                paddingHorizontal={25}
                height={"80%"}
                justifyContent="center"
                gap="$5"
                maxWidth={500}
                width="100%"
                alignItems="center"
            >
                <BackButton />
                <XStack
                    paddingHorizontal={8}
                    paddingVertical={4}
                >
                    <Text
                        fontSize="$8"
                        textAlign="center"
                        color={colors.primaryWhite}
                    >
                        Create a password
                    </Text>
                </XStack>

                <InputComponent
                    name="Password"
                    value={password}
                    setValue={setPassword}

                    error={error}
                    extraOptions={{
                        secureTextEntry: true,
                        autoCapitalize: "none",
                        autoCorrect: false,
                        returnKeyType: "done",
                    }}
                />

                <Button
                    borderRadius="$4"
                    width="100%"
                    height={"$4"}
                    onPress={handleEmail}
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

                {
                    user.name ??
                    <View>
                        <Text color={colors.primaryWhite}>Forgot Password?</Text>
                    </View>
                }
                {/* <Text color={colors.primaryWhite}>Forgot Password?</Text> */}
            </YStack>
            {loading && <Overlay />}
        </GradientBackground >
    )
}