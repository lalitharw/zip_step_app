import { colors } from "@/constants/theme";
import { View } from "tamagui";

export default function SeparatorVertical(){
    return (
        <View height={"100%"} width={1} backgroundColor={colors.LINE} marginHorizontal={12}></View>
    )
}