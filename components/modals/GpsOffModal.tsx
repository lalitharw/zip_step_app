import { colors } from "@/constants/theme";
import { HugeiconsIcon } from '@hugeicons/react-native';
import { LocationOffline01Icon } from '@hugeicons/core-free-icons';
import { Modal } from "react-native";
import { Button, Text, View } from "tamagui";
import { openAppDetailsSettings } from "../Linking/openAppDetailsSettings";

export default function GpsOffModal({ isVisible }: { isVisible: boolean }) {

    return (
        <Modal
            visible={
                isVisible
            }
            transparent
            animationType="fade"
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
                        <Text fontSize={26}><HugeiconsIcon
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
                        textAlign="center">Location is off
                    </Text>
                    <Text
                        color="$color11"
                        fontSize={14}
                        textAlign="center"
                        marginTop="$2"
                        lineHeight={20}>
                        Please turn on Location to continue
                    </Text>

                    <Button onPress={openAppDetailsSettings} marginTop={"$3"} size={"$4"}>Okay</Button>
                </View>

            </View>


        </Modal>
    )
}