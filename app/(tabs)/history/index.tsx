import ActivityCard from "@/components/ActivityCard"
import GradientBackground from "@/components/GradientBackground"
import ActivityCardHistorySkeleton from "@/components/skeleton_loading/ActivityCardHistorySkeleton"
import { colors } from "@/constants/theme"
import { useAuth } from "@/context/AuthContext"
import { Activity, getAllActivitiesOnlyIfLocationPointIsPresent } from "@/database/activities"
import { router } from "expo-router"
import LottieView from "lottie-react-native"
import { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native"
import { ScrollView, Text, View, YStack } from "tamagui"


export default function index() {
    const [activities, setActivities] = useState<Activity[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const { user } = useAuth()

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
                                <ActivityCard {...item} />
                            )}
                            contentContainerStyle={{ gap: 14, paddingBottom: 40 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    progressBackgroundColor={"#0F1318"}
                                    colors={["#1397c3"]}
                                    tintColor={"#1397c3"}
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
                                    progressBackgroundColor={"#0F1318"}
                                    colors={["#1397c3"]}
                                    tintColor={"#1397c3"}
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
                                    color={colors.primaryWhite}
                                >
                                    No Data Found
                                </Text>

                                <Text
                                    onPress={() => router.push({ pathname: "/(tabs)" })}
                                    fontSize={"$4"}
                                    fontWeight={"600"}
                                    color={colors.primaryWhite}
                                    backgroundColor="#1397c3"
                                    paddingHorizontal={28}
                                    paddingVertical={13}
                                    borderRadius={999}
                                    overflow="hidden"
                                    marginTop={"$3"}
                                    pressStyle={{ opacity: 0.8, scale: 0.97 }}
                                >
                                    Create Activity
                                </Text>
                            </YStack>
                        </ScrollView>
                    )
            }
        </View>
    </GradientBackground>
);
    
}