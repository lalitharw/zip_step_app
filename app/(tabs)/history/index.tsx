import ActivityCard from "@/components/ActivityCard"
import GradientBackground from "@/components/GradientBackground"
import { Activity, getAllActivity } from "@/database/activities"
import { Link } from "expo-router"
import { AnimatePresence } from "moti"
import { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { View } from "tamagui"


export default function index() {
    const [activities, setActivities] = useState<Activity[] | null>([])
    useEffect(() => {
        const loadActivities = async () => {
            const data = await getAllActivity()
            setActivities(data)
        }
        loadActivities()
    }, [])

    return (
        <GradientBackground>
            <SafeAreaView>
                <View paddingHorizontal={20}>
                    <AnimatePresence>
                        <FlatList
                            data={activities}
                            keyExtractor={(item) => item.id.toString()}
                            // ListFooterComponent={loading ? <ActivityIndicator /> : null}
                            onEndReachedThreshold={0.5}
                            renderItem={({ item }) => (
                                <ActivityCard text={item.id} />
                            )}
                        />
                    </AnimatePresence>
                </View>
            </SafeAreaView>
        </GradientBackground>
    )
}