import { useTheme } from "@/context/ThemeContext"
import { View } from "tamagui"

export default function SeparatorHorizontal() {
    const { theme } = useTheme()
    return (

        <View width={"100%"} height={1} backgroundColor={theme.separator} marginVertical={12}></View>
    )
}