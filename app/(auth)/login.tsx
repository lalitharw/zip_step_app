import GradientBackground from "@/components/GradientBackground";
import InputComponent from "@/components/Input";
import ErrorModal from "@/components/modals/ErrorModal";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Keyboard, KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import {
    Button,
    H4,
    Image,
    Overlay,
    Spinner,
    Text,
    XStack,
    YStack,
} from "tamagui";

export default function Login() {

    const { login, googleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const [loginError, setLoginError] = useState<string | null>(null);




    const isValidEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
    };


    useEffect(() => {
        const trimmedEmail = email.trim();


        if (!trimmedEmail) {
            return;
        }


        if (!isValidEmail(trimmedEmail)) {
            setEmailError("Please enter a valid email address.");
        }

        const timeout = setTimeout(async () => {
            try {
                setCheckingEmail(true);

                const response = await api.post("/auth/check-email", {
                    email: trimmedEmail,
                });

                // console.log("Email check:", response.data.data);


                const exists = response.data?.data?.exists;

                if (exists === false) {
                    setEmailError(
                        "No account found with this email. Please sign up."
                    );
                } else {
                    setEmailError("");
                }
            } catch (error: any) {
                console.log(
                    "Email Check Failed:",
                    error?.response?.data
                );
            } finally {
                setCheckingEmail(false);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [email]);


    const validateLogin = () => {
        let valid = true;

        setEmailError("");
        setPasswordError("");


        if (!email.trim()) {
            setEmailError("Email is required.");
            valid = false;
        }


        else if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email address.");
            valid = false;
        }


        if (!password) {
            setPasswordError("Password is required.");
            valid = false;
        }

        return valid;
    };


    const handleEmailChange = (value: string) => {
        setEmail(value);


        setEmailError("");
    };


    const handlePasswordChange = (value: string) => {
        setPassword(value);

        setPasswordError("");
    };


    async function handleLogin() {
        if (!validateLogin()) {
            return;
        }

        if (checkingEmail) {
            return;
        }

        setLoading(true);

        try {
            Keyboard.dismiss()
            await login(email.trim(), password);

            router.replace("/(tabs)");
        } catch (err: any) {
            console.log("Login error:", err);

            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";

            setLoginError(message);
        } finally {
            setLoading(false);
        }
    }


    async function handleGoogleLogin() {
        try {
            Keyboard.dismiss()
            setLoginError(null);
            setGoogleLoading(true);

            await googleLogin();

            router.replace("/(tabs)");
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setLoginError(message);
        } finally {
            setGoogleLoading(false);
        }
    }


    const buttonDisabled =
        loading ||
        googleLoading ||
        checkingEmail ||
        !email.trim() ||
        !password ||
        !isValidEmail(email);

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
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 20,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <YStack
                        flex={1}
                        justifyContent="center"
                        gap="$5"
                        maxWidth={500}
                        width="100%"
                        alignSelf="center"
                    >


                        <YStack
                            backgroundColor="rgba(255,255,255,0.06)"
                            borderWidth={1}
                            borderColor="rgba(255,255,255,0.10)"
                            borderRadius="$6"
                            gap="$4"
                            paddingVertical={"$6"}
                            paddingHorizontal={"$4"}
                        >

                            <YStack
                                gap="$2"
                                alignItems="center"
                                marginBottom="$2"
                            >
                                <H4
                                    fontSize={28}
                                    color="#edede9"
                                    fontWeight="bolder"
                                    letterSpacing={-1}

                                >
                                    Login
                                </H4>

                                <Text
                                    color="#edede9"
                                    opacity={0.55}
                                    fontSize="$3"
                                >
                                    Enter your details to login.
                                </Text>
                            </YStack>


                            <YStack gap="$5">

                                <InputComponent
                                    name="Email"
                                    value={email}
                                    setValue={handleEmailChange}
                                    error={emailError}
                                    placeholder="example@gmail.com"
                                    extraOptions={{
                                        onChangeText:
                                            handleEmailChange,
                                        keyboardType:
                                            "email-address",
                                        autoCapitalize: "none",
                                        autoCorrect: false,
                                        returnKeyType: "next",
                                    }}
                                />

                                <InputComponent
                                    name="Password"
                                    value={password}
                                    setValue={handlePasswordChange}
                                    error={passwordError}
                                    placeholder="••••••••"
                                    extraOptions={{
                                        secureTextEntry: true,
                                        returnKeyType: "done",
                                        onChangeText:
                                            handlePasswordChange,
                                    }}
                                />
                            </YStack>

                            <XStack
                                justifyContent="flex-end"
                                width="100%"
                            >
                                <Text
                                    onPress={() =>
                                        router.push(
                                            "/(auth)/forgoutPassword"
                                        )
                                    }
                                    fontSize="$2"
                                    color="#edede9"
                                    opacity={0.8}
                                    pressStyle={{
                                        opacity: 0.5,
                                    }}
                                >
                                    Forgot Password?
                                </Text>
                            </XStack>

                            <Button
                                borderRadius="$4"
                                width="100%"
                                height={52}
                                onPress={handleLogin}
                                disabled={buttonDisabled}
                                backgroundColor={buttonDisabled ? "#e5e7eb" : "#edede9"}
                                opacity={buttonDisabled ? 0.6 : 1}
                                pressStyle={{
                                    scale: 0.98,
                                    opacity: 0.9,
                                }}
                            >
                                {loading ? (
                                    <Spinner
                                        size="small"
                                        color="#111"
                                    />
                                ) : (
                                    <Text
                                        color={buttonDisabled ? "#000104c6" : "#111"}
                                        fontSize="$3"
                                        fontWeight="700"
                                    >
                                        Sign In
                                    </Text>
                                )}
                            </Button>

                            <XStack
                                alignItems="center"
                                gap="$3"
                                marginVertical={"$3"}
                                opacity={0.5}
                            >
                                <YStack
                                    flex={1}
                                    height={1}
                                    backgroundColor="#edede9"
                                />

                                <Text
                                    color="#edede9"
                                    fontSize="$2"
                                >
                                    OR
                                </Text>

                                <YStack
                                    flex={1}
                                    height={1}
                                    backgroundColor="#edede9"
                                />
                            </XStack>

                            <Button
                                onPress={handleGoogleLogin}
                                width="100%"
                                height={52}
                                backgroundColor="white"
                                borderRadius="$4"
                                borderWidth={0}
                                disabled={googleLoading || loading}
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

                                            <Text fontWeight={"bold"}>
                                                Continue with Google
                                            </Text>
                                        </XStack>
                                    )}
                                </XStack>
                            </Button>



                            <XStack
                                justifyContent="center"
                                alignItems="center"

                            >
                                <Text
                                    color="#edede9"
                                    opacity={0.55}

                                >
                                    Don't have an account yet?
                                </Text>

                                <Text
                                    onPress={() =>
                                        router.push("/(auth)/register")
                                    }
                                    fontWeight="800"
                                    color="#edede9"
                                    marginLeft="$1"
                                    pressStyle={{
                                        opacity: 0.5,
                                    }}
                                    textDecorationLine="underline"
                                >
                                    Sign Up
                                </Text>
                            </XStack>
                        </YStack>
                    </YStack>
                </ScrollView>


            </KeyboardAvoidingView>

            {(loading || googleLoading) && <Overlay />}

            <ErrorModal
                visible={!!loginError}
                message={loginError ?? ""}
                onClose={() => setLoginError(null)}
            />
        </GradientBackground>
    );
}