import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Button, Text, YStack } from "tamagui";

export default function ErrorModal({
    visible,
    message,
    onClose,
}: {
    visible: boolean;
    message: string;
    onClose: () => void;
}) {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
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
    }, [visible]);

    if (!visible) {
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
                    backgroundColor="rgba(255,80,80,0.15)"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="$4"
                >
                    <Text
                        fontSize={30}
                        color="#ff6464"
                        fontWeight="700"
                    >
                        !
                    </Text>
                </YStack>

                <Text
                    color="#edede9"
                    fontSize="$6"
                    fontWeight="700"
                    marginBottom="$2"
                >
                    Login failed
                </Text>

                <Text
                    color="#edede9"
                    opacity={0.65}
                    fontSize="$3"
                    textAlign="center"
                    lineHeight={22}
                >
                    {message}
                </Text>

                <Button
                    marginTop="$5"
                    width="100%"
                    height={48}
                    borderRadius="$4"
                    backgroundColor="#edede9"
                    onPress={onClose}
                >
                    <Text
                        color="#111"
                        fontWeight="700"
                    >
                        OK
                    </Text>
                </Button>
            </Animated.View>
        </Animated.View>
    );
}