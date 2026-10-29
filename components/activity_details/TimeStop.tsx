import { useTheme } from "@/context/ThemeContext";
import { View,Text } from "tamagui";
import { formatTime, formatDate } from "@/utils/formatUnits";

export default function TimeStop({ label, ms, align = "flex-start" }: { label: string, ms: string | number, align: "flex-start" | "flex-end" | "center" }) {
    const {theme} = useTheme()    
    return (
            <View flex={1} alignItems={align}  gap={2}>
                <Text color={theme.secondaryText} fontSize={13}>{label}</Text>
                <Text color={theme.text} fontSize={18} fontWeight="600">{formatTime(ms)}</Text>
                <Text color={theme.secondaryText} fontSize={13}>{formatDate(ms)}</Text>
            </View>
        );
    }