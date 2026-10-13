import { MotiView } from "moti";
import { View } from "tamagui";

export default function ActivityCardHistorySkeleton() {
    return (
        <View
            marginBottom={50}
            padding={10}
            backgroundColor="#4c48482b"
            borderRadius={8}
            overflow="hidden"
        >
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
                    borderRadius: 4,
                    backgroundColor: "#333",
                }}
            />
            <View paddingTop={10} gap={12}>
                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        loop: true,
                    }}
                    style={{
                        width: 100,
                        height: 14,
                        borderRadius: 4,
                        backgroundColor: "#333",
                    }}
                />

            </View>
            
            <View flexDirection="row" gap={"$3"} justifyContent="space-between" paddingVertical={10}>
                <MotiView
                    
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        loop: true,
                    }}
                    style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: "#333",
                    }}
                />
                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        loop: true,
                    }}
                    style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: "#333",
                    }}
                />
            </View>
            <View flexDirection="row" gap={"$3"} justifyContent="space-between" paddingVertical={10}>
                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        loop: true,
                    }}
                    style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: "#333",
                    }}
                />
                <MotiView
                    from={{ opacity: 0.4 }}
                    animate={{ opacity: 0.8 }}
                    transition={{
                        type: "timing",
                        duration: 800,
                        loop: true,
                    }}
                    style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: "#333",
                    }}
                />
            </View>
        </View>
    )
}