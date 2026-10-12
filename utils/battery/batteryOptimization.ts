import * as Battery from "expo-battery";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";
import logger from "../logging/logger";


export async function ensureBatteryOptimizationIgnored() {
    if (Platform.OS !== "android") return

    try {
        const isBatteryOptimizationEnabled = await Battery.isBatteryOptimizationEnabledAsync();
        logger.info("Battery Optimization", "", isBatteryOptimizationEnabled)

        if (!isBatteryOptimizationEnabled) return

        await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, {
            data: 'package:com.anonymous.stride_flow_app'
        })
    }
    catch (error) {
        console.log(error)
        // await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        //     { data: "package:com.anonymous.stride_flow_app" }
        // )
    }
}