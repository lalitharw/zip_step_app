import { useAuth } from '@/context/AuthContext';
import { startActivity } from '@/services/activity/activityService';
import { requestBackgroundLocationPermission, requestForegroundLocationPermission } from '@/services/locationService';
import { useActivityStatsStore } from '@/store/ActivityStatsStore';
import { ensureBatteryOptimizationIgnored } from '@/utils/battery/batteryOptimization';
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
        if (user !== null) {
            await startActivity(user?.id)
        }
    }


    const handleStartActivity = async () => {
        try {
            setLoading(true);

            await requestForegroundLocationPermission();

            const background =
                await Location.getBackgroundPermissionsAsync();


            if (background.granted) {
                setPermissionDeniedPermanently(false);
                await ensureBatteryOptimizationIgnored()
                await startWorkout();
                return;
            }

            setPermissionDeniedPermanently(!background.canAskAgain);
            setShowBackgroundDisclosure(true);
            return;

        } catch (error) {
            console.error("Unable to start activity:", error);

            Toast.show({
                type: "error",
                position: "top",
                text1: "Unable to start workout",
                text2:
                    error instanceof Error
                        ? error.message
                        : "Please check your location settings and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDisclosureContinue = async () => {
        try {
            setLoading(true);
            setShowBackgroundDisclosure(false);

            await requestBackgroundLocationPermission();

            setPermissionDeniedPermanently(false);
            await startWorkout();
        } catch (error) {
            console.error("Background location permission error:", error);

            const permission =
                await Location.getBackgroundPermissionsAsync();

            if (!permission.granted && !permission.canAskAgain) {
                setPermissionDeniedPermanently(true);
                setShowBackgroundDisclosure(true);
            } else {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Background location permission denied",
                    text2: "Please allow background location to track your workout.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

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