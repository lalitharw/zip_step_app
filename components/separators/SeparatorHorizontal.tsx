import { colors } from "@/constants/theme"
import {View} from "tamagui"

export default function SeparatorHorizontal(){
    return (
        <View width={"100%"} height={1} backgroundColor={colors.LINE} marginVertical={12}></View>
    )
}