import { colors } from "@/constants/theme"
import { discardActivity } from "@/services/activity/activityService"
import { storeResumeActivity } from "@/services/ActivityPauseService"
import { useActivityPauseStore } from "@/store/ActivityPauseStore"
import { useLocationStore } from "@/store/locationStore"
import { useState } from "react"
import { Modal } from "react-native"
import { Button, Spinner, Text, View, XStack } from "tamagui"

export default function LessActivityModal() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const locationStore = useLocationStore()
    const ActivityPauseStore = useActivityPauseStore()
    const handleDiscard = async () => {
        try {

            setIsLoading(true)
            await discardActivity()
            useLocationStore.getState().setShowActivityPointModal(false)
        }
        finally {
            setIsLoading(false)
        }

    }

    const handleResume = async () => {
        try {
            setIsLoading(true)
            locationStore.setShowActivityPointModal(false)
            ActivityPauseStore.setIsActivityPaused(false)
            await storeResumeActivity()
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            visible={locationStore.showActivityPointModal}
            transparent
            animationType="fade"
        >
            <View flex={1} alignItems="center" backgroundColor={colors.lessOpacityBlack} justifyContent="center" paddingHorizontal={"$5"}>
                <View alignItems="center" justifyContent="center" backgroundColor={colors.primaryBlack} borderRadius={"$6"} padding={"$6"} borderWidth={1} borderColor={colors.primaryWhite}>
                    <Text
                        color={colors.primaryWhite}
                        fontSize={20}
                        fontWeight="700"
                        textAlign="center">Not moving yet?
                    </Text>
                    <Text
                        color="$color11"
                        fontSize={14}
                        textAlign="center"
                        marginTop="$2"
                        lineHeight={20}>
                        StrideFlow needs a longer activity to upload and proccess
                    </Text>

                    <XStack gap={"$3"} marginTop={"$6"}>
                        <Button onPress={handleDiscard} disabled={isLoading} color={colors.primaryWhite} flex={1} borderColor={"$borderColor"} backgroundColor={"$colorTransparent"}>
                            {
                                isLoading ? <Spinner
                                    size="small"
                                    color="$green10"
                                /> : "Discard"
                            }
                        </Button>
                        <Button disabled={isLoading} onPress={handleResume} flex={1}>
                            Resume
                        </Button>
                    </XStack>
                </View>

            </View>
        </Modal>
    )
}