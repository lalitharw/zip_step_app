import { colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { LocationOffline01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Modal } from "react-native";
import { Button, Text, View, XStack } from "tamagui";
import { openAppDetailsSettings } from "../Linking/openAppDetailsSettings";

export default function GpsOffModal({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
    const { theme } = useTheme()
    return (
        <Modal
            visible={
                isVisible
            }
            transparent
            animationType="fade"
        >
            <View flex={1} alignItems="center" backgroundColor={colors.lessOpacityBlack} justifyContent="center" paddingHorizontal={"$5"}>
                <View alignItems="center" justifyContent="center" backgroundColor={theme.background} borderRadius={"$6"} padding={"$6"} borderWidth={1} borderColor={colors.primaryWhite}>
                    <View
                        width={56}
                        height={56}
                        borderRadius={28}
                        backgroundColor="$backgroundStrong"
                        alignItems="center"
                        justifyContent="center"
                        marginBottom="$4"
                    >
                        <Text fontSize={26}><HugeiconsIcon
                            icon={LocationOffline01Icon}
                            size={40}
                            color={theme.icon}
                            strokeWidth={1.5}
                        /></Text>
                    </View>
                    <Text
                        color={theme.text}
                        fontSize={20}
                        fontWeight="700"
                        textAlign="center">GPS is disabled
                    </Text>
                    <Text
                        color="$color11"
                        fontSize={14}
                        textAlign="center"
                        marginTop="$2"
                        lineHeight={20}>
                        GPS access is disabled. Would you like to adjust settings to allow GPS access
                    </Text>

                    <XStack gap={"$2"}>
                        <Button backgroundColor={theme.buttonPrimary} color={theme.buttonPrimaryText} onPress={() => {
                            onClose()
                            openAppDetailsSettings()
                        }} marginTop={"$3"} size={"$4"}>Okay</Button>
                        <Button  onPress={() => {
                            onClose()
                        }} marginTop={"$3"} size={"$4"}>Cancel</Button>
                    </XStack>

                </View>

            </View>


        </Modal>
    )
}