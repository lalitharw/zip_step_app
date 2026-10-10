import { colors } from "@/constants/theme";
import { LocationOffline01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Linking, Modal } from "react-native";
import { Button, Text, View, XStack } from "tamagui";

type LocationPermissionModalProps = {
    isVisible: boolean,
    onClose: () => void,
    onContinue: () => void,
    permissionDeniedPermanently?: boolean
}

export default function LocationPermissionModal({ isVisible, onClose, onContinue, permissionDeniedPermanently = false }: LocationPermissionModalProps) {
    return (
        <Modal
            visible={
                isVisible
            }
            transparent
            animationType="slide"
        >
            <View flex={1} alignItems="center" backgroundColor={colors.lessOpacityBlack} justifyContent="center" paddingHorizontal={"$5"}>
                <View alignItems="center" justifyContent="center" backgroundColor={colors.primaryBlack} borderRadius={"$6"} padding={"$6"} borderWidth={1} borderColor={colors.primaryWhite}>
                    <View
                        width={56}
                        height={56}
                        borderRadius={28}
                        backgroundColor="$backgroundStrong"
                        alignItems="center"
                        justifyContent="center"
                        marginBottom="$4"
                    >
                        <Text fontSize={26}>
                            <HugeiconsIcon
                                icon={LocationOffline01Icon}
                                size={40}
                                color={colors.primaryWhite}
                                strokeWidth={1.5}
                            /></Text>
                    </View>
                    <Text
                        color={colors.primaryWhite}
                        fontSize={20}
                        fontWeight="700"
                        textAlign="center">Keep your run on track
                    </Text>
                    <Text
                        color="$color11"
                        fontSize={14}
                        textAlign="center"
                        marginTop="$2"
                        lineHeight={20}>
                        StrideFlow collects location data to record
                        your running route, distance and pace during
                        active workouts, even when the app is in the
                        background or your screen is locked.

                        Your location is used for workout tracking
                        and related activity features.
                    </Text>
                    <XStack marginTop={"$3"} gap={"$2"}>
                        {
                            permissionDeniedPermanently ?
                                (
                                    <Button size={"$3"} onPress={() => {
                                        onClose()
                                        Linking.openSettings()}}>
                                        Go to Settings
                                    </Button>
                                ) :
                                (
                                    <Button size={"$3"} onPress={onContinue}>
                                        Continue
                                    </Button>
                                )
                        }

                        <Button size={"$3"} onPress={onClose}>
                            Not Now
                        </Button>
                    </XStack>
                </View>

            </View>
        </Modal>
    )
}