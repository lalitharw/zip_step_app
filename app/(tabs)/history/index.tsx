import ActivityCard from "@/components/ActivityCard"
import GradientBackground from "@/components/GradientBackground"
import ActivityCardHistorySkeleton from "@/components/skeleton_loading/ActivityCardHistorySkeleton"
import { Activity, getAllActivitiesOnlyIfLocationPointIsPresent, getAllActivity } from "@/database/activities"
import { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { View } from "tamagui"


export default function index() {
    const [activities, setActivities] = useState<Activity[] | null>([])
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const loadActivities = async () => {
            console.log(await getAllActivity())
            const data = await getAllActivitiesOnlyIfLocationPointIsPresent()
            setActivities(data)
        }
        loadActivities()
    }, [])

    if (loading) {
        return (
            <GradientBackground>
                <View flex={1}
                    paddingHorizontal={20}
                    paddingVertical={10}>
                    <ActivityCardHistorySkeleton />
                    <ActivityCardHistorySkeleton />
                    <ActivityCardHistorySkeleton />
                </View>
            </GradientBackground>
        )
    }

    return (
        <GradientBackground>
            <View
                flex={1}
                paddingHorizontal={20}
                paddingVertical={10}
            >
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <ActivityCard {...item} />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </GradientBackground>
    )
}