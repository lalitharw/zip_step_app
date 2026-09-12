import GradientBackground from "@/components/GradientBackground";
import { getActivityWithLocationPoints } from "@/database/activities";
import { Camera, GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "tamagui";

export default function ActivityDetail() {
    const { id } = useLocalSearchParams()
    const [activity, setActivity] = useState<any>({})
    const [locationPoints, setLocationPoints] = useState<any>([])



    useEffect(() => {
        if (!id) return
        const handleGetActivityData = async () => {
            try {
                const data = await getActivityWithLocationPoints(id)
                if (data) {
                    setActivity(data.activity)
                    setLocationPoints(data.location_points)
                }
            }
            catch (error) {
                console.error("DB Error: ", error)
            }
        }

        handleGetActivityData()
    }, [id])


    const routeGeoJSON = {
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: locationPoints.map((point:{longitude:number,latitude:number}) => [
                point.longitude,
                point.latitude,
            ]),
        },
    };

    const MAPTILER_API_KEY = "xvEVbRhauAEaNQ1Ucv4L";
    return (
        <GradientBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <View height={420}>
                        <Map style={{ flex: 1, overflow: "hidden" }}
                            mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`}
                            logo={false}
                            attribution={false}
                            compass={false}
                        >
                            {locationPoints.length > 0 && (
                                <>
                                    <Camera
                                        center={[locationPoints[0].longitude, locationPoints[0].latitude]}
                                        zoom={18}
                                    />

                                    <GeoJSONSource
                                        id="recorded-route"
                                        data={routeGeoJSON}
                                    >
                                        <Layer
                                            type="line"
                                            id="recorded-route-line"
                                            style={{
                                                lineColor:
                                                    "#1397c3",
                                                lineWidth: 5,
                                                lineCap:
                                                    "round",
                                                lineJoin:
                                                    "round",
                                            }}
                                        />
                                    </GeoJSONSource>
                                </>
                            )}
                        </Map>
                    </View>

                    <View padding={20}>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    )
}