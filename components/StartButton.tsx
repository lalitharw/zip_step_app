import { useAuth } from '@/context/AuthContext';
import { startActivity } from '@/services/activity/activityService';
import { useActivityStatsStore } from '@/store/ActivityStatsStore';
import { clearLog } from '@/utils/logging/fileLogger';
import { stopAccelerometer, subscribeAccelerometer } from '@/utils/sensors/accelerometer';
import { subscribeBarometer } from '@/utils/sensors/barometer';
import { shareLog } from '@/utils/sharing/debugLoggerShare';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { Button, Spinner } from "tamagui";


type StartButtonProps = {
    lastLoadedId: React.MutableRefObject<number | null>
}

export default function StartButton({ lastLoadedId }: StartButtonProps) {
    const {user} = useAuth()
    const [isLoading, setLoading] = useState<boolean>(false)
    let accelerometer: ReturnType<typeof subscribeAccelerometer> | null = null

    const handleStartActivity = async () => {
        try {
            stopAccelerometer()
            accelerometer = subscribeAccelerometer()
            setLoading(true)
            useActivityStatsStore.getState().resetStats()
            lastLoadedId.current = 0
            await clearLog()
            await startActivity(user?.id)
        }
        catch (error) {
            console.log("Something went wrong: ", error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
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

            {/* {
                __DEV__ && <Button marginTop={20} onPress={() => shareLog()}>Share</Button>
            } */}
        </>
    )
}