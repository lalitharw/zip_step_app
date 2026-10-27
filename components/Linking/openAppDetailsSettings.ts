import * as Location from "expo-location";
import { Platform } from "react-native";
import * as Linking from "expo-linking"
import { useLocationStore } from "@/store/locationStore";

export const openAppDetailsSettings = async () => {
    try {
        if (Platform.OS === 'android') {
            await Location.enableNetworkProviderAsync();

            // const enabled = await Location.hasServicesEnabledAsync()
            // useLocationStore.getState().setIsGpsOff(!enabled)
            
        } else {
            await Linking.openSettings();
        }
    }
    catch (error) {
        console.error("Unable to open system settings automatically")

        if(Platform.OS === 'android'){
            Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
        }
    }
}
