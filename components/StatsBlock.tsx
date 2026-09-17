import { colors } from "@/constants/theme";
import { Text, View } from "tamagui";

export default function StatBlock({
    label,
    value,
    unit,
    align = "flex-start",
    emphasize = false,
    compact = false,
    paddingVertical = 0,
    paddingHorizontal = 0
}: {
    label: string
    value: string | number
    unit: string
    align?: "flex-start" | "center" | "flex-end"
    emphasize?: boolean
    compact?: boolean,
    paddingVertical?: number,
    paddingHorizontal?: number
}) {
    return (
        <View flex={1} paddingVertical={paddingVertical} paddingHorizontal={paddingHorizontal} alignItems={align} gap={4}>
            <Text color={colors.secondaryWhite} fontSize={12}>
                {label}
            </Text>
            <Text
                color={emphasize ? "#1397c3" : colors.primaryWhite}
                fontSize={compact ? 20 : 24}
                fontWeight={compact ? "600" : "700"}
            >
                {value}
                <Text color={colors.secondaryWhite} fontSize={13} fontWeight="400">
                    {" "}{unit}
                </Text>
            </Text>
        </View>
    )
}