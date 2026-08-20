import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const notifyActivityInactive = async () => {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Activity still recording",
                body: "You haven't moved for 15 minutes. Are you still recording?"
            },
            trigger: null
        })

    }
    catch (error) {
        console.log("Notification wrong: ", error)
    }
}

export const setUpNotificationChannel = async () => {
    try {
        console.log("Setting up Notifications...")
        const permission = await Notifications.getPermissionsAsync()

        console.log("Current Notification permission: ", permission.status)

        if (permission.status !== "granted") {
            const requested = await Notifications.requestPermissionsAsync()
            if (requested.status !== "granted") {
                console.log("Notificiation Permission denied")
                return false
            }
        }

        console.log("Making notification ready")
        await Notifications.setNotificationChannelAsync("activity", {
            name: "Activity",
            importance: Notifications.AndroidImportance.HIGH
        })
        console.log("Notification Ready")
        return true

    }
    catch (error) {
        console.error("Notification setup failed: ", error)
        return false
    }

}