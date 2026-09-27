import { startActivity } from '@/services/activityService';
import { useActivityStatsStore } from '@/store/ActivityStatsStore';
import { clearLog } from '@/utils/logging/fileLogger';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { Button, Spinner } from "tamagui";


type StartButtonProps = {
    lastLoadedId: React.MutableRefObject<number | null>
}

export default function StartButton({ lastLoadedId }: StartButtonProps) {
    const [isLoading, setLoading] = useState<boolean>(false)


    const handleStartActivity = async () => {
        try {
            setLoading(true)
            useActivityStatsStore.getState().resetStats()
            lastLoadedId.current = 0
            await clearLog()
            await startActivity()

        }
        catch (error) {
            console.log("Something went wrong: ", error)
        }
        finally {
            setLoading(false)
        }
    }

    return (

        <Button onPress={handleStartActivity} width={90} disabled={isLoading} height={90} borderRadius={"50%"}>
            {
                isLoading ? <Spinner
                    size="small"
                    color="$green10"
                />
                    :
                    <HugeiconsIcon
                        icon={PlayIcon}
                    />
            }
        </Button>
    )
}