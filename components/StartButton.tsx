import { useAuth } from '@/context/AuthContext';
import { startActivity } from '@/services/activity/activityService';
import { requestBackgroundLocationPermission, requestForegroundLocationPermission } from '@/services/locationService';
import { useActivityStatsStore } from '@/store/ActivityStatsStore';
import { stopAccelerometer, subscribeAccelerometer } from '@/utils/sensors/accelerometer';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import * as Location from "expo-location";
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { Button, Spinner } from "tamagui";
import LocationPermissionModal from './permissions/LocationPermissionModal';


type StartButtonProps = {
    lastLoadedId: React.MutableRefObject<number | null>
}

export default function StartButton({ lastLoadedId }: StartButtonProps) {
    const { user } = useAuth()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [showBackgroundDisclosure, setShowBackgroundDisclosure] = useState<boolean>(false)
    const [permissionDeniedPermanently, setPermissionDeniedPermanently] = useState<boolean>(false)
    

    const startWorkout = async () => {
        stopAccelerometer()
        subscribeAccelerometer()

        useActivityStatsStore.getState().resetStats()
        lastLoadedId.current = 0

        await startActivity(user?.id)
    }


    const handleStartActivity = async () => {
        try {
            setLoading(true)
            await requestForegroundLocationPermission()
            const background = await Location.getBackgroundPermissionsAsync()
            if (background.granted) {
                await startWorkout()
            }
            else {
                setShowBackgroundDisclosure(true)
            }
        }
        catch (error) {
            Toast.show({
                type: "error",
                position: "bottom"
            })
        }
        finally {
            setLoading(false)
        }
    }

    const handleDisclosureContinue = async () => {
        try {
            setShowBackgroundDisclosure(true)
            await requestBackgroundLocationPermission()
            await startWorkout()
        }
        catch (error) {
            
            const permission = await Location.getBackgroundPermissionsAsync()

            if (!permission.granted && !permission.canAskAgain) {
                setPermissionDeniedPermanently(true)
                setShowBackgroundDisclosure(true)
            }

            // Toast.show({
            //     type: "error",
            //     position: "top",
            //     text1: "Background location permission denied",
            //     text2: !permission.canAskAgain
            //         ? "Please enable it in Settings to continue."
            //         : "Please grant permission to record workouts in the background.",
            // });
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

            <LocationPermissionModal permissionDeniedPermanently={permissionDeniedPermanently} onContinue={handleDisclosureContinue} isVisible={showBackgroundDisclosure} onClose={() => setShowBackgroundDisclosure(false)} />
        </>
    )
}