import { colors } from "@/constants/theme";
import LottieView from "lottie-react-native";
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

                        <LottieView style={{ width: 100, height: 100 }} loop={true} autoPlay={true} source={require("../../assets/animation/location.json")} />
                    </View>
                    <Text
                        color={colors.primaryWhite}
                        fontSize={20}
                        fontWeight="700"
                        textAlign="center">Location Access
                    </Text>
                    {permissionDeniedPermanently ? (
                        <Text
                            color="$color11"
                            fontSize={14}
                            textAlign="left"
                            marginTop="$2"
                            lineHeight={22}
                        >
                            To track workouts in the background:
                            {"\n\n"}1. Tap Go to Settings below.
                            {"\n"}2. Open Permissions → Location.
                            {"\n"}3. Select Allow all the time.
                            {"\n"}4. Return to StrideFlow and start your workout again.
                        </Text>
                    ) : (
                        <>
                        
                        <Text
                            color="$color11"
                            fontSize={14}
                            textAlign="center"
                            marginTop="$2"
                            lineHeight={20}
                        >
                            StrideFlow needs location access to track your route,
                            distance, and pace, even when your phone is locked.
                        </Text>
                        <Text
                            color="$color11"
                            fontSize={14}
                            textAlign="center"
                            marginTop="$2"
                            lineHeight={20}
                        >
                            You must select "Always Allow" on the next screen for strideFlow to work.
                        </Text>
                        </>
                    )}
                    <XStack alignItems="center" marginTop={"$3"} gap={"$5"}>
                        {
                            permissionDeniedPermanently ?
                                (
                                    <Button size={"$3"} onPress={() => {
                                        onClose()
                                        Linking.openSettings()
                                    }}>
                                        Go to Settings
                                    </Button>
                                ) :
                                (
                                    <Button size={"$3"} onPress={onContinue}>
                                        Continue
                                    </Button>
                                )
                        }

                        <Text color={colors.primaryWhite} onPress={onClose}>
                            Maybe Later
                        </Text>
                    </XStack>
                </View>

            </View>
        </Modal>
    )
}