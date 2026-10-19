import { useAuth } from "@/context/AuthContext";
import { Alert01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import Toast from "react-native-toast-message";

import { Button, Image, Spinner, Text, XStack, YStack } from "tamagui";

export default function GoogleLoginModal({ visible }: { visible: boolean; }) {
    const { googleLogin } = useAuth()
    const [isVisible,setIsVisible] = useState<boolean>(visible)
    const [loading, setLoading] = useState<boolean>(false)

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            const res = await googleLogin()

            router.replace("/(tabs)")
        }
        catch (error) {
            setIsVisible(false)
            Toast.show({
                type: "error",
                position: "bottom"
            })
        }
        finally {
            setLoading(false)
        }
    }

    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scale, {
                    toValue: 1,
                    friction: 7,
                    tension: 80,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            opacity.setValue(0);
            scale.setValue(0.8);
        }
    }, [isVisible]);

    if (!isVisible) {
        return null;
    }

    return (
        <Animated.View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                backgroundColor: "rgba(0,0,0,0.7)",
                justifyContent: "center",
                alignItems: "center",
                opacity,
            }}
        >
            <Animated.View
                style={{
                    width: "85%",
                    maxWidth: 380,
                    backgroundColor: "#181818",
                    borderRadius: 24,
                    padding: 24,
                    alignItems: "center",
                    transform: [{ scale }],
                }}
            >

                <YStack
                    width={64}
                    height={64}
                    borderRadius={32}
                    backgroundColor="rgba(229, 255, 80, 0.15)"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$4"
                >
                    <Text
                        fontSize={30}
                        color="#d8ff64"
                        fontWeight="700"
                    >
                        <HugeiconsIcon
                            icon={Alert01Icon}
                            size={40}
                            color="#d8ff64"
                            strokeWidth={1.5}
                        />
                    </Text>
                </YStack>

                <Text
                    color="#edede9"
                    fontSize="$6"
                    fontWeight="700"
                    textAlign="center"
                // marginBottom="$2"
                >
                    This email is linked to a Google account.
                </Text>

                <Text
                    color="#edede9"
                    opacity={0.65}
                    fontSize="$3"
                    textAlign="center"
                    lineHeight={22}
                >

                </Text>

                <Button
                    marginTop="$2"
                    width="100%"
                    size={"$4"}
                    disabled={loading}
                    borderRadius="$4"
                    backgroundColor="#edede9"
                    onPress={handleGoogleLogin}
                >
                    <XStack
                        alignItems="center"
                        justifyContent="center"
                        gap="$2"
                        width="100%"
                    >
                        {loading ? (
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
            </Animated.View>
        </Animated.View>
    );
}