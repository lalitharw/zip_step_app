import Card from "@/components/activity/Card"
import GradientBackground from "@/components/GradientBackground"
import ActivityCardHistorySkeleton from "@/components/skeleton_loading/ActivityCardHistorySkeleton"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { Activity, getAllActivitiesOnlyIfLocationPointIsPresent } from "@/database/activities"
import { router } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { Button, ScrollView, Text, View, YStack } from "tamagui"


export default function index() {
    const [activities, setActivities] = useState<Activity[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { user } = useAuth()
    const { theme } = useTheme()

    const loadActivities = async () => {
        try {
            setLoading(true)
            const data = await getAllActivitiesOnlyIfLocationPointIsPresent(user.id)
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
                paddingTop={16}
            >
                {
                    activities && activities?.length > 0 ?
                        (
                            <FlatList
                                data={activities}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <Card {...item} />
                                )}
                                contentContainerStyle={{ gap: 14, paddingBottom: 40 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        progressBackgroundColor={theme.background}
                                        colors={[theme.primary]}
                                        tintColor={theme.background}
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        )
                        :
                        (
                            <ScrollView
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingBottom: 60
                                }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        progressBackgroundColor={theme.background}
                                        colors={[theme.primary]}
                                        tintColor={theme.background}
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                            >
                                <YStack gap={"$2"} justifyContent="center" alignItems="center">
                                    <LottieView
                                        style={{ width: 280, height: 280 }}
                                        source={require("../../../assets/animation/empty_data.json")}
                                        loop
                                        autoPlay
                                    />

                                    <Text
                                        fontSize={"$8"}
                                        fontWeight={"700"}
                                        letterSpacing={-0.5}
                                        color={theme.text}
                                    >
                                        No Data Found
                                    </Text>



                                    <Button marginTop={20} onPress={() => router.push("/(tabs)")} backgroundColor={theme.buttonPrimary} color={theme.buttonPrimaryText}>Create Activity</Button>
                                </YStack>
                            </ScrollView>
                        )
                }
            </View>
        </GradientBackground>
    );

}