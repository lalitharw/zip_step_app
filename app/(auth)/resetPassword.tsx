import { resetPasswordAuth } from "@/api/authenticationApi"
import GradientBackground from "@/components/GradientBackground"
import InputComponent from "@/components/Input"
import SuccessModal from "@/components/modals/SuccessModal"
import * as Linking from "expo-linking"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { Keyboard } from "react-native"
import Toast from "react-native-toast-message"
import { Button, H4, Spinner, Text, YStack } from "tamagui"
import * as yup from "yup"

const resetPasswordSchema = yup.object({
    password: yup.string().required("Password is required").min(8).max(15),
    confirmPassword: yup.string().required("Confirm Password is required").oneOf([yup.ref("password")], "Password must match")
})

export default function resetPassword() {

    useEffect(() => {
        Linking.getInitialURL().then((url) => {
          
        })
    }, [])

    const testing = useLocalSearchParams()
    const { token, email } = useLocalSearchParams<{
        token: string,
        email: string
    }>()



    const [data, setData] = useState<{
        password: string,
        confirmPassword: string
    }>({
        password: "",
        confirmPassword: ""
    })



    const [loading, setLoading] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string | null>("")
    const [errors, setErrors] = useState<{
        password?: string,
        confirmPassword?: string
    }>({})


    const handleResetPassword = async () => {

        if (!email || !token) {
            // AlertDialog({ title: "Invalid Link", description: "This password reset link is invalid or incomplete", type: "error" })
            Toast.show({
                type: "error",
                text1: "This password reset link is invalid or incomplete"
            })
            return
        }
        try {
            Keyboard.dismiss()
            await resetPasswordSchema.validate(
                {
                    password: data.password,
                    confirmPassword: data.confirmPassword
                },
                {
                    abortEarly: false
                }
            )
            setLoading(true)
            setErrors({})

            const res = await resetPasswordAuth({
                email,
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            })

            if (res.success === true) {
                setData({
                    password: "",
                    confirmPassword: ""
                })
                setSuccessMessage(res.message)
            }

        }
        catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: {
                    password?: string;
                    confirmPassword?: string
                } = {}

                error.inner.forEach((item) => {
                    if (item.path == "password") {
                        newErrors.password = item.message
                    }

                    if (item.path == "confirmPassword") {
                        newErrors.confirmPassword = item.message
                    }
                })

                setErrors(newErrors)
            }
            else {
                // AlertDialog({ title: "Error", description: "Something went wrong! Try Again Later", type: "error" })
                Toast.show({
                    type: "error"
                })
            }
        }
        finally {
            setLoading(false)
        }
    }

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
                            Reset Password
                        </H4>
                    </YStack>

                    <InputComponent
                        name="Password"
                        value={data.password}
                        setValue={(value) => setData((prev) => ({
                            ...prev,
                            password: value
                        }))}
                        error={errors.password}
                        placeholder="********"
                        extraOptions={{
                            keyboardType: "email-address",
                            autoCapitalize: "none",
                            autoCorrect: false,
                            returnKeyType: "done",
                        }}
                    />
                    <InputComponent
                        name="Confirm Password"
                        value={data.confirmPassword}
                        setValue={(value) => setData((prev) => ({
                            ...prev,
                            confirmPassword: value
                        }))}
                        error={errors.confirmPassword}
                        placeholder="********"
                        extraOptions={{
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
                        onPress={handleResetPassword}
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
                                /> : "Confirm"
                            }
                        </Text>
                    </Button>


                </YStack>
            </YStack>

            <SuccessModal visible={!!successMessage} message={successMessage ?? ""} onClose={() => {
                setSuccessMessage(null)
                router.replace("/(auth)/login")
            }} />


        </GradientBackground>
    )
}