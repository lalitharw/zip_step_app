import BackButton from "@/components/buttons/BackButton";
import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import GoogleLoginModal from "@/components/modals/GoogleLoginModal";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import { Button, Overlay, Spinner, Text, XStack, YStack } from "tamagui";
import * as yup from "yup";

const emailSchema = yup.object({
    email: yup.string().required("Email is required").email("The email address you entered is not a valid email")
})

export default function emailForm() {
    const { checkEmail } = useAuth()
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [hasGoogleLogin, setHasGoogleLogin] = useState<boolean>(false)

    const handleEmail = async () => {
        try {
            Keyboard.dismiss()
            await emailSchema.validate(
                {
                    email
                },
                {
                    abortEarly: false
                }
            )
            setLoading(true)

            const res = await checkEmail(email)
    

            if (res.success === true) {
                if (res.data.has_google) {
                    setHasGoogleLogin(true)
                    return
                }

                
                    router.push({
                        pathname:"/(auth)/passwordForm",
                        params:{
                            email,
                            exists: res.data.exists
                        }
                    })
                    return 
              
            }
        }

        catch (error) {
            if (error instanceof yup.ValidationError) {
                error.inner.forEach((item) => {
                    if (item.path == "email") {
                        setError(item.message)
                    }
                })
            }
            else{
                Toast.show({
                    type:"error",
                    position:"bottom"
                })
            }
        }
        finally {
            setEmail("")
            setLoading(false)
        }
    }

    return (
        <GradientBackground>


            <YStack
                paddingHorizontal={25}

                justifyContent="center"
                gap="$5"
                maxWidth={500}
                height={"80%"}
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
                        Sign up or log in to start exploring
                    </Text>
                </XStack>

                <InputComponent
                    name="Email"
                    value={email}
                    setValue={setEmail}
                    error={error}
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
                    height={"$4"}
                    disabled={loading}
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
            </YStack>


            {loading && <Overlay />}
            {hasGoogleLogin && <GoogleLoginModal visible={hasGoogleLogin} />}
        </GradientBackground>
    )
}