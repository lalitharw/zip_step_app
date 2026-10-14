import { colors } from '@/constants/theme';
import { storeResumeActivity } from '@/services/ActivityPauseService';
import { Backward01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Button, Text, YStack } from "tamagui";


export default function ResumeButton() {

    const handleResumeActivity = async () => {
        try {
            await storeResumeActivity()
        }
        catch (error) {
            console.error("Something went wrong: ", error)
        }
    }

    return (
        <Button onPress={handleResumeActivity} backgroundColor={colors.primaryBlack} width={80} height={80} borderRadius={"50%"}>
            <YStack justifyContent='center' alignItems='center'>
                <HugeiconsIcon transform={[{ rotate: "180deg" }]} color={colors.primaryWhite}
                    icon={Backward01Icon}
                />
                <Text fontSize={10} color={colors.primaryWhite}>Resume</Text>
            </YStack>
        </Button>
    )
}