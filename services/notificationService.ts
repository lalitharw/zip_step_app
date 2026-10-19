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
        const permission = await Notifications.getPermissionsAsync()


        if (permission.status !== "granted") {
            const requested = await Notifications.requestPermissionsAsync()
            if (requested.status !== "granted") {
                return false
            }
        }

        await Notifications.setNotificationChannelAsync("activity", {
            name: "Activity",
            importance: Notifications.AndroidImportance.HIGH
        })
        return true

    }
    catch (error) {
        console.error("Notification setup failed: ", error)
        return false
    }

}