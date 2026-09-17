import { MotiView } from "moti"
import { View } from "tamagui"

export default function ActivityCardDetailSkeleton() {
    return (
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
                    borderRadius: 4,
                    backgroundColor: "#333",
                }}
            />
        </View>
    )
}