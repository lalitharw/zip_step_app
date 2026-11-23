import * as Battery from "expo-battery";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";


export async function ensureBatteryOptimizationIgnored() {
    if (Platform.OS !== "android") return

    try {
        const isBatteryOptimizationEnabled = await Battery.isBatteryOptimizationEnabledAsync();

        if (!isBatteryOptimizationEnabled) return

        await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, {
            data: 'package:com.anonymous.zip_step_app'
        })
    }
    catch (error) {
        console.log(error)
        // await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        //     { data: "package:com.anonymous.stride_flow_app" }
        // )
    }
}