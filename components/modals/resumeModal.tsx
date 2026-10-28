import { colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { stopActivity } from "@/services/activity/activityService";
import { useLocationStore } from "@/store/locationStore";
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from "react";
import { Modal } from "react-native";
import { Button, Spinner, Text, View, XGroup } from "tamagui";

export default function ResumeModal({ isVisible }: { isVisible: boolean }) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const setShowResumeModal = useLocationStore((state) => state.setShowResumeModal)
    const { theme } = useTheme()
    const handleDiscardActivity = async () => {

        try {
            setIsLoading(true)
            await stopActivity()
            setShowResumeModal(false)
        }
        catch (error) {
            console.error("Something went wrong: ", error)
            throw error
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            visible={
                isVisible
            }
            transparent
            animationType="fade"
        >


            <View flex={1} alignItems="center" justifyContent="center" backgroundColor={colors.lessOpacityBlack} paddingHorizontal={"$5"}>
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
                        <Text fontSize={26}><HugeiconsIcon size={40} color={theme.icon} icon={PlayIcon} /></Text>
                    </View>
                    <Text
                        color={theme.text}
                        fontSize={20}
                        fontWeight="700"
                        textAlign="center">Activity in Progress
                    </Text>
                    <Text
                        color={theme.secondaryText}
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
                            disabled={isLoading}
                            borderRadius="$4"
                            backgroundColor={theme.buttonDanger}
                            onPress={() => {
                                handleDiscardActivity()
                            }}
                        >
                            <Text color={colors.primaryWhite}>
                                {isLoading ? (
                                    <Spinner
                                        size="small"
                                        color="$green10"
                                    />
                                ) : (
                                    "Discard"
                                )}
                            </Text>
                        </Button>

                        <Button
                            flex={1}
                            borderRadius="$4"
                           
                            
                            onPress={() => setShowResumeModal(false)}
                        >
                            <Text color={theme.buttonPrimaryText} fontWeight="600">
                                Resume
                            </Text>
                        </Button>
                    </XGroup>

                </View>

            </View>


        </Modal>
    )
}