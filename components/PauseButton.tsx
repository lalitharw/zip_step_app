import { colors } from '@/constants/theme';
import { storePauseActivity } from '@/services/ActivityPauseService';
import { PauseIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Button } from "tamagui";


export default function PauseButton() {

    const handlePauseActivity = async () => {
        try {
            await storePauseActivity()
        }
        catch (error) {
            console.error("Something went wrong:", error)
        }
    }
    return (
        <Button onPress={handlePauseActivity} backgroundColor={colors.primaryBlack} width={60} height={60} borderRadius={"50%"}>
            <HugeiconsIcon
                color={colors.primaryWhite}
                icon={PauseIcon}
            />
        </Button>
    )
}