import { colors } from '@/constants/theme';
import { Alert01Icon, Delete01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

import { Button, Spinner, Text, XStack, YStack } from "tamagui";

export default function DeleteModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
   
    const [loading,setLoading] = useState<boolean>(false)

    const handleDelete = () => {
        try{
            setLoading(true)
            
        }
        finally{
            setLoading(false)
        }
    }

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
                    backgroundColor="rgba(137, 30, 62, 0.15)"
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
                            color="#ab1842"
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
                    Are you sure you want to delete activity?
                </Text>

                <Text
                    color="#edede9"
                    opacity={0.65}
                    fontSize="$3"
                    textAlign="center"
                    lineHeight={22}
                >

                </Text>


                <XStack gap={"$3"} >
                    <Button disabled={loading}>
                        <XStack gap={"$2"} alignItems='center'>
                            {
                                loading ?

                                    <>
                                        <Spinner
                                            size="small"
                                            color="#111"
                                        />
                                    </>
                                    :

                                    <>
                                        <HugeiconsIcon icon={Delete01FreeIcons} />
                                        <Text fontWeight={"bold"}>Delete</Text>
                                    </>
                            }


                        </XStack>
                    </Button>
                    <Button borderColor={colors.primaryWhite} onPress={() => onClose()} backgroundColor="transparent">
                        <Text color={colors.primaryWhite} fontWeight={"bold"}>Cancel</Text>
                    </Button>
                </XStack>

              
            </Animated.View>
        </Animated.View>
    );
}