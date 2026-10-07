import BackButton from "@/components/buttons/BackButton";
import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import SuccessModal from "@/components/modals/SuccessModal";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import { Button, Overlay, Spinner, Text, XStack, YStack } from "tamagui";
import * as yup from "yup";

const nameSchema = yup.object({
    name: yup.string().required("Name is required")
})

export default function nameForm() {
    const { setName } = useAuth()

    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleName = async () => {
        try {
            Keyboard.dismiss()
            await nameSchema.validate(
                {
                    name: userName
                },
                {
                    abortEarly: false
                }
            )

            setError("")
            setLoading(true)

            const res = await setName(userName)



            if (res.success === true) {
                if (res.data.user.name) {
                    setSuccessMessage(res.message)
                }
                else {
                    router.replace("/(tabs)/history")
                }
            }
        }

        catch (error: any) {
            console.log(error);

            if (error instanceof yup.ValidationError) {
                error.inner.forEach((item) => {
                    if (item.path === "name") {
                        setError(item.message);
                    }
                });
            }
            else {
                Toast.show({
                    text1: error.response.data.message ?? "Something went wrong. Please try again.",
                    type: "error",
                    position: "bottom",
                });
            }
        }
        finally {
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
                        Enter your name
                    </Text>
                </XStack>

                <InputComponent
                    name="Name"
                    value={userName}
                    setValue={setUserName}

                    error={error}
                    extraOptions={{
                        autoCapitalize: "none",
                        autoCorrect: false,
                        returnKeyType: "done",
                    }}
                />

                <Button
                    borderRadius="$4"
                    width="100%"
                    height={"$4"}
                    disabled={loading}
                    onPress={handleName}
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
            <SuccessModal visible={!!successMessage} message={successMessage} onClose={() => router.replace("/(tabs)")} />
            {loading && <Overlay />}
        </GradientBackground >
    )
}