import * as Linking from "expo-linking";
import { Platform } from "react-native";
import * as Location from "expo-location"

export const openAppDetailsSettings = async () => {
    try {
        if (Platform.OS === 'android') {
            Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
        } else {
            await Linking.openSettings();
        }
    }
    catch (error) {
        console.error("Unable to open system settings automatically")

        if (Platform.OS === 'android') {
            await Linking.openSettings();
        }
    }
}


export const enableDeviceLocation = async () => {
    try {
        if (Platform.OS === "android") {
            await Location.enableNetworkProviderAsync();
        } else {
            await Linking.openSettings();
        }
    } catch (error) {
        console.error("Unable to enable device location:", error);

        if (Platform.OS === "android") {
            await Linking.sendIntent(
                "android.settings.LOCATION_SOURCE_SETTINGS"
            );
        }
    }
};