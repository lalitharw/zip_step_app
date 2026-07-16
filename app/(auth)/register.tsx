import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, H4, Spinner, Text, View, XStack, YStack } from "tamagui";

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
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <YStack flex={1} justifyContent="center" padding={"$4"} gap={"$4"} >
                        <YStack paddingHorizontal={10} gap={"$2"} alignItems="center">
                            <H4 fontSize={30} textAlign="center" marginBottom={10} color="#edede9" fontWeight="600" >
                                Sign Up to StrideFlow
                            </H4>
                            <Text textAlign="center" color={"#edede967"}>Create your account</Text>
                        </YStack>

                        <YStack gap={"$2"}>
                            <View>
                                <InputComponent
                                    name="Name*"
                                    value={name}
                                    setValue={setName}
                                    placeholder="Alex Smith"

                                />
                            </View>
                            <View>
                                <InputComponent
                                    name="Email*"
                                    value={email}
                                    setValue={setEmail}
                                    placeholder="example@gmail.com"
                                    extraOptions={{
                                        keyboardType: "email-address"
                                    }}

                                />
                            </View>
                            <View>
                                <InputComponent
                                    name="Password*"
                                    value={password}
                                    setValue={setPassword}
                                    placeholder="••••••••"
                                    extraOptions={{
                                        secureTextEntry: true
                                    }}

                                />
                            </View>
                        </YStack>
                        <Button onPress={handleRegister}
                            borderRadius={"$10"} >
                            {isLoading ? <Spinner size="small" color="$green10" /> : "Register"}
                        </Button>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
            <XStack justifyContent="center" marginTop={"auto"} pb={"$6"}>
                <Text color={"#edede967"}>Already have an account?</Text><Text onPress={() => router.push("/(auth)/login")} fontWeight={900} color={"#edede9"}> Sign In</Text>
            </XStack>
        </GradientBackground >
    )
}