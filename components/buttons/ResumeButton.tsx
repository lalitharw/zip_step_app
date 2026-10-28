import { colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { storeResumeActivity } from '@/services/ActivityPauseService';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Button, Text, XStack } from "tamagui";


export default function ResumeButton() {
    const {theme} = useTheme()
    const handleResumeActivity = async () => {
        try {
            await storeResumeActivity()
        }
        catch (error) {
            console.error("Something went wrong: ", error)
        }
    }

    return (
        <Button size={"$6"} width="40%" onPress={handleResumeActivity} backgroundColor={theme.buttonPrimary}>
            <XStack gap={"$1"} justifyContent='center' alignItems='center'>
                <HugeiconsIcon color={theme.buttonPrimaryText}
                    icon={PlayIcon}
                />
                <Text color={theme.buttonPrimaryText}>Resume</Text>
            </XStack>
        </Button>
    )
}