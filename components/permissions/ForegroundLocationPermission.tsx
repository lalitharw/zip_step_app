import { colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import LottieView from "lottie-react-native";
import { Linking, Modal } from "react-native";
import { Button, Text, View, XStack } from "tamagui";

type LocationPermissionModalProps = {
    isVisible: boolean,
    onClose: () => void,
    onContinue: () => void,
    permissionDeniedPermanently?: boolean
}

export default function ForegroundLocationPermission({ isVisible, onClose, onContinue, permissionDeniedPermanently = false }: LocationPermissionModalProps) {
    const { theme } = useTheme()
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
                        backgroundColor={theme.background}
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
                        textAlign="center">ZipSteps needs to access your location while using the app
                    </Text>
                    {permissionDeniedPermanently ? (
                        <Text
                            color="$color11"
                            fontSize={14}
                            textAlign="left"
                            marginTop="$2"
                            lineHeight={22}
                        >
                            To start tracking your workout:
                            {"\n\n"}1. Tap Go to Settings below.
                            {"\n"}2. Open Permissions → Location.
                            {"\n"}3. Select Allow while using the app.
                            {"\n"}4. Return to StrideFlow and tap Start again.
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
                                StrideFlow needs location access to record your route, measure the distance you travel, and calculate your pace during workouts.
                            </Text>
                            <Text
                                color="$color11"
                                fontSize={14}
                                textAlign="center"
                                marginTop="$2"
                                lineHeight={20}
                            >
                                Please allow location access to start tracking your workout.
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