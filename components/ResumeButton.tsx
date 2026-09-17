import { colors } from '@/constants/theme';
import { storeResumeActivity } from '@/services/ActivityPauseService';
import { Backward01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Button } from "tamagui";


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
        <Button onPress={handleResumeActivity} backgroundColor={colors.primaryBlack} width={60} height={60} borderRadius={"50%"}>
            <HugeiconsIcon transform={[{rotate: "180deg"}]} color={colors.primaryWhite}
                icon={Backward01Icon}
            />
        </Button>
    )
}