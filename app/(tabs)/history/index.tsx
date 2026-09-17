import ActivityCard from "@/components/ActivityCard"
import GradientBackground from "@/components/GradientBackground"
import ActivityCardHistorySkeleton from "@/components/skeleton_loading/ActivityCardHistorySkeleton"
import { Activity, getAllActivitiesOnlyIfLocationPointIsPresent } from "@/database/activities"
import { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { View } from "tamagui"


export default function index() {
    const [activities, setActivities] = useState<Activity[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)

    const loadActivities = async () => {
        try {
            setLoading(true)
            const data = await getAllActivitiesOnlyIfLocationPointIsPresent()
            setActivities(data)
        }
        catch (error) {
            console.error("Something went wrong: ", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadActivities()
    }, [])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await loadActivities()
        setRefreshing(false)
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
                    renderItem={({ item }) => (
                        <ActivityCard {...item} />
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} progressBackgroundColor={"black"} colors={["grey"]} onRefresh={onRefresh} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </GradientBackground>
    )
}