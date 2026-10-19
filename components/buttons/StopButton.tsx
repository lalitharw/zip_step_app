import { resetActivity } from '@/services/activity/activityLifeCycle';
import { stopActivity } from '@/services/activity/activityService';
import { stopLocationTracking } from '@/services/locationService';
import { useLocationStore } from '@/store/locationStore';
import { getCurrentActivityId } from '@/utils/activity';
import { saveMapSnapShot } from '@/utils/maps/saveMapSnapShot';
import { mapSnapShot } from '@/utils/mapSnapShot';
import { StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Spinner, Text, XStack } from "tamagui";


type StopButtonProps = {
    mapRef: Parameters<typeof mapSnapShot>[0]
}

export default function StopButton({ mapRef }: StopButtonProps) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const locationStore = useLocationStore()
    const handleStopTracking = async () => {

        if (locationStore.routeCoordinates.length < 5) {
            locationStore.setShowActivityPointModal(true)
            return
        }

        try {
            const activityId = await getCurrentActivityId();
            await stopLocationTracking()
            setLoading(true)
            await mapSnapShot(mapRef)
            await saveMapSnapShot()
            await stopActivity()
            await resetActivity()



            if (activityId) {
                router.push(`/(tabs)/history/${activityId}`)
            }

        }
        catch (error) {
            console.log("Something went wrong: ", error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <Button width={"60%"} onPress={handleStopTracking} size={"$6"} disabled={isLoading}>

            {
                isLoading ?
                    <Spinner
                        size="small"
                        color="$green10"
                    />
                    :
                    <XStack gap={"$1"} alignItems='center'>

                        <HugeiconsIcon
                            icon={StopIcon}
                        />
                        <Text>Finish</Text>
                    </XStack>
            }
        </Button>
    )
}