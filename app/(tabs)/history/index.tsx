import ActivityCard from "@/components/ActivityCard"
import GradientBackground from "@/components/GradientBackground"
import { Activity, getAllActivitiesOnlyIfLocationPointIsPresent, getAllActivity } from "@/database/activities"
import { useEffect, useState } from "react"
import { FlatList } from "react-native"
import { View } from "tamagui"


export default function index() {
    const [activities, setActivities] = useState<Activity[] | null>([])
    useEffect(() => {
        const loadActivities = async () => {
            console.log(await getAllActivity())
            const data = await getAllActivitiesOnlyIfLocationPointIsPresent()
            setActivities(data)
        }
        loadActivities()
    }, [])

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