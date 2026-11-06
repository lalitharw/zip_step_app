import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { startActivity } from '@/services/activity/activityService';
import { requestForegroundLocationPermission } from '@/services/locationService';
import { useActivityStatsStore } from '@/store/ActivityStatsStore';
import { stopAccelerometer, subscribeAccelerometer } from '@/utils/sensors/accelerometer';
import { PlayIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Spinner } from "tamagui";
import GpsOffModal from '../modals/GpsOffModal';
import ForegroundLocationPermission from '../permissions/ForegroundLocationPermission';


type StartButtonProps = {
    lastLoadedId: React.MutableRefObject<number | null>
}

export default function StartButton({ lastLoadedId }: StartButtonProps) {
    const { user } = useAuth()
    const { theme } = useTheme()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [showBackgroundDisclosure, setShowBackgroundDisclosure] = useState<boolean>(false)
    const [permissionDeniedPermanently, setPermissionDeniedPermanently] = useState<boolean>(false)

    const [showForegroundDisclosure, setShowForegroundDisclosure] = useState<boolean>(false)
    const [ForegroundPermissionDeniedPermanently, setForegroundPermissionDeniedPermanently] = useState<boolean>(false)

    const [isGpsModalVisible, setIsGpsModalVisible] = useState<boolean>(false)



    const startWorkout = async () => {
        if (user !== null) {
            stopAccelerometer()
            subscribeAccelerometer()
            useActivityStatsStore.getState().resetStats()
            lastLoadedId.current = 0
            await startActivity(user?.id)
        }
    }


    const handleStartActivity = async () => {
        setLoading(true);
        try {
            const foreground = await requestForegroundLocationPermission()
            if (foreground.status == "permanently_denied") {
                setForegroundPermissionDeniedPermanently(true)
                setShowForegroundDisclosure(true)
                return
            }


            if (foreground.status === "denied") {
                Toast.show({
                    type: "error",
                    text1: "Location permission denied",
                    text2: "Allow location access to start tracking.",
                })
                return
            }

            // await requestForegroundLocationPermission();
            // setForegroundPermissionDeniedPermanently(false)
            // setIsGpsModalVisible(false)

            // const background =
            //     await Location.getBackgroundPermissionsAsync();




            // if (background.granted) {
            //     setPermissionDeniedPermanently(false);
            //     await ensureBatteryOptimizationIgnored()

            //     await startWorkout();
            //     return;
            // }



            if (foreground.status === "gps_disabled") {
                setIsGpsModalVisible(true)
                return
            }


            await startWorkout()

            // setPermissionDeniedPermanently(!background.canAskAgain);
            // setShowBackgroundDisclosure(true);
            // return;


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


    const handleForegroundSettings = async () => {
        setShowForegroundDisclosure(false)
        await Linking.openSettings()
    }

    // const handleBackgroundSettings = async () => {
    //     try {
    //         setLoading(true);
    //         setShowBackgroundDisclosure(false);

    //         await requestBackgroundLocationPermission();

    //         setPermissionDeniedPermanently(false);
    //         await startWorkout();
    //     } catch (error) {
    //         console.error("Background location permission error:", error);

    //         const permission =
    //             await Location.getBackgroundPermissionsAsync();

    //         if (!permission.granted && !permission.canAskAgain) {
    //             setPermissionDeniedPermanently(true);
    //             setShowBackgroundDisclosure(true);
    //         } else {
    //             Toast.show({
    //                 type: "error",
    //                 position: "top",
    //                 text1: "Background location permission denied!",
    //                 text2: "Please allow background location to track your workout.",
    //             });
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <>
            <Button backgroundColor={theme.buttonPrimary} onPress={handleStartActivity} width={90} disabled={isLoading} height={90} borderRadius={"50%"}>
                {
                    isLoading ? <Spinner
                        size="small"
                        color={theme.spinner}
                    />
                        :
                        <HugeiconsIcon
                            icon={PlayIcon}
                        />

                }
            </Button>

            {/* <LocationPermissionModal permissionDeniedPermanently={permissionDeniedPermanently} onContinue={handleBackgroundSettings} isVisible={showBackgroundDisclosure} onClose={() => setShowBackgroundDisclosure(false)} /> */}
            <ForegroundLocationPermission permissionDeniedPermanently={ForegroundPermissionDeniedPermanently} onContinue={handleForegroundSettings} isVisible={showForegroundDisclosure} onClose={() => setShowForegroundDisclosure(false)} />
            <GpsOffModal isVisible={isGpsModalVisible} onClose={() => setIsGpsModalVisible(false)} />
        </>
    )
}