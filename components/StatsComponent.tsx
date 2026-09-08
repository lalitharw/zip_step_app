import { colors } from "@/constants/theme"
import { Text, View } from "tamagui"

type statsType = {
    label: string,
    value: string,
    fontSize?: number | null,
    flex: number
}

export default function StatsComponent({ label, value, fontSize, flex }: statsType) {
    return (
        <View justifyContent="center" alignItems="center" flex={flex} padding={15} >
            <Text marginBottom={6} textTransform="capitalize" color={colors.secondaryWhite}>{label}</Text>
            <Text fontSize={fontSize ?? 15} color={colors.primaryWhite}>
                {value}
            </Text>
        </View>
    )
}