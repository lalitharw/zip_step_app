import { MotiView } from "moti"
import { View } from "tamagui"

export default function ActivityCardDetailSkeleton() {
    return (
        <View>
            <View>

                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        loop: true,
                    }}
                    style={{
                        height: 420,
                        width: "100%",
                        borderBottomRightRadius: 28,
                        borderBottomLeftRadius: 28,
                        backgroundColor: "#333",
                    }}
                />
            </View>

            <View marginTop={10} padding={20}>
                <View>
                    <MotiView
                        from={{ opacity: 0.4 }}
                        animate={{ opacity: 0.8 }}
                        transition={{
                            type: "timing",
                            duration: 800,
                            loop: true,
                        }}
                        style={{
                            height: 120,
                            width: "100%",
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.04)",
                            backgroundColor: "#333",
                        }}
                    />
                </View>
                <View marginTop={20}>
                    <MotiView
                        from={{ opacity: 0.4 }}
                        animate={{ opacity: 0.8 }}
                        transition={{
                            type: "timing",
                            duration: 800,
                            loop: true,
                        }}
                        style={{
                            height: 120,
                            width: "100%",
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.04)",
                            backgroundColor: "#333",
                        }}
                    />
                </View>
                <View marginTop={20}>
                    <MotiView
                        from={{ opacity: 0.4 }}
                        animate={{ opacity: 0.8 }}
                        transition={{
                            type: "timing",
                            duration: 800,
                            loop: true,
                        }}
                        style={{
                            height: 120,
                            width: "100%",
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.04)",
                            backgroundColor: "#333",
                        }}
                    />
                </View>
            </View>
        </View>
    )
}