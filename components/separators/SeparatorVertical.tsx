import { useTheme } from "@/context/ThemeContext";
import { View } from "tamagui";

export default function SeparatorVertical() {
    const { theme } = useTheme()
    return (
        <View height={"100%"} width={1} backgroundColor={theme.separator} marginHorizontal={12}></View>
    )
}