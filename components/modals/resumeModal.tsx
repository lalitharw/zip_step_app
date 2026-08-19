import { colors } from "@/constants/theme";
import { stopActivity } from "@/services/api/LocationApi";
import { useLocationStore } from "@/store/locationStore";
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Modal } from "react-native";
import { Button, Text, View, XGroup } from "tamagui";

export default function ResumeModal({ isVisible }: { isVisible: boolean }) {
    const setShowResumeModal = useLocationStore((state) => state.setShowResumeModal)
    return (
        <Modal
            visible={
                isVisible
            }
            transparent
            animationType="fade"
        >


            <View flex={1} alignItems="center" justifyContent="center" paddingHorizontal={"$5"}>
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
                        <Text fontSize={26}><HugeiconsIcon size={40} color={colors.primaryWhite} icon={PlayIcon} /></Text>
                    </View>
                    <Text
                        color={colors.primaryWhite}
                        fontSize={20}
                        fontWeight="700"
                        textAlign="center">Activity in Progress
                    </Text>
                    <Text
                        color="$color11"
                        fontSize={14}
                        textAlign="center"
                        marginTop="$2"
                        lineHeight={20}>
                        You have an activity that wasn't finished.
                        {"\n"}
                        Would you like to resume it?
                    </Text>

                    <XGroup width={"100%"} gap={"$3"} marginTop={"$6"}>
                        <Button
                            flex={1}
                            borderRadius="$4"
                            backgroundColor="transparent"
                            borderWidth={1}
                            borderColor="$borderColor"
                            onPress={() => {
                                stopActivity()
                                setShowResumeModal(false)
                            }}
                        >
                            <Text color={colors.primaryWhite}>
                                Discard
                            </Text>
                        </Button>

                        <Button
                            flex={1}
                            borderRadius="$4"
                            backgroundColor={colors.primaryWhite}
                            onPress={() => setShowResumeModal(false)}
                        >
                            <Text color="black" fontWeight="600">
                                Resume
                            </Text>
                        </Button>
                    </XGroup>

                </View>

            </View>


        </Modal>
    )
}