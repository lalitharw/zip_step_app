import { stopActivity } from '@/services/activityService';
import { mapSnapShot } from '@/utils/mapSnapShot';
import { StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { Button, Spinner } from "tamagui";


type StopButtonProps = {
    mapRef: Parameters<typeof mapSnapShot>[0]
}

export default function StopButton({ mapRef }: StopButtonProps) {
    const [isLoading, setLoading] = useState<boolean>(false)

    const handleStopTracking = async () => {
        try {
            setLoading(true)
            await mapSnapShot(mapRef)
            await stopActivity()
        }
        catch (error) {
            console.log("Something went wrong: ", error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <Button onPress={handleStopTracking} width={90} disabled={isLoading} height={90} borderRadius={"50%"}>

            {
                isLoading ?
                    <Spinner
                        size="small"
                        color="$green10"
                    />
                    :
                    <HugeiconsIcon
                        icon={StopIcon}
                    />
            }
        </Button>
    )
}