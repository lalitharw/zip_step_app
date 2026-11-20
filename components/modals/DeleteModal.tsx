import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { softDeleteActivity } from '@/database/activities';
import { softDeleteActivityPause } from '@/database/activityPause';
import { softDeleteLocationPoints } from '@/database/locationPoints';
import { Alert01Icon, Delete01FreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import {  useEffect, useRef, useState } from "react";
import { Animated, Modal } from "react-native";
import Toast from 'react-native-toast-message';
import { View } from 'tamagui';

import { Button, Spinner, Text, XStack, YStack } from "tamagui";

export default function DeleteModal({ visible, onClose, activityId }: { visible: boolean, onClose: () => void, activityId:  string }) {
    const { theme } = useTheme()
    const [loading, setLoading] = useState<boolean>(false)
    
    const handleDelete = async() => {
        setLoading(true)
        try {
            
            await softDeleteLocationPoints(activityId)
            await softDeleteActivity(activityId)
            await softDeleteActivityPause(activityId)
            Toast.show({
                type: "success",
                position: "top",
                text1: "Activity Deleted Successfully"
            })
            router.replace("/(tabs)/history")
        }
        catch(error){
            console.error("Failed to perform delete operations: ",error)
        }
        finally {
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

        <Modal
            visible={
                visible
            }
            transparent
            animationType="fade"
        >
            <View flex={1} alignItems="center" justifyContent="center" backgroundColor={colors.lessOpacityBlack} paddingHorizontal={"$5"}>
                <View alignItems="center" justifyContent="center" backgroundColor={theme.background} borderRadius={"$6"} padding={"$6"} borderWidth={1} borderColor={theme.tileBorder}>
                    <YStack
                        width={64}
                        height={64}
                        borderRadius={88}
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
                        color={theme.text}
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
                        <Button onPress={handleDelete} backgroundColor={theme.buttonDanger}  disabled={loading}>
                            <XStack gap={"$2"} alignItems='center'>
                                {
                                    loading ?

                                        <>
                                            <Spinner
                                                size="small"
                                                color={theme.buttonDangerText}
                                            />
                                        </>
                                        :

                                        <>
                                            <HugeiconsIcon color={theme.buttonDangerText} icon={Delete01FreeIcons} />
                                            <Text color={theme.buttonDangerText} >Delete</Text>
                                        </>
                                }


                            </XStack>
                        </Button>
                        <Button backgroundColor={theme.buttonSecondary} onPress={() => onClose()}>
                            <Text color={theme.buttonSecondaryText} fontWeight={"bold"}>Cancel</Text>
                        </Button>
                    </XStack>
                </View>
            </View>
        </Modal>


    );
}