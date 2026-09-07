import { colors } from "@/constants/theme"
import { Text, View } from "tamagui"

type statsType = {
    label: string,
    value: string,
    fontSize?: number | null
}

export default function StatsComponent({ label, value, fontSize }: statsType) {
    return (
        <View alignItems="center" paddingHorizontal={20} paddingVertical={20}>
            <Text textTransform="capitalize" color={colors.secondaryWhite}>{label}</Text>
            <Text fontSize={fontSize ?? 18} color={colors.primaryWhite}>
                {value}
            </Text>
        </View>
    )
}