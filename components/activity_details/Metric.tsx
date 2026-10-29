import { useTheme } from "@/context/ThemeContext";
import { View,Text } from "tamagui";

export default function  Metric({ label, value, unit }: { label: string, value: number | string, unit: number | string }) {
    const {theme} = useTheme()     
    return (
        <View
                flex={1}
                backgroundColor={theme.tileBg}
                borderRadius={20}
                borderWidth={1}
                borderColor={theme.tileBorder}
                paddingVertical={16}
                paddingHorizontal={16}
                gap={6}
            >
                <View flexDirection="row" alignItems="flex-end" gap={4}>
                    <Text color={theme.text} fontSize={26} fontWeight="700" letterSpacing={-0.5}>
                        {value}
                    </Text>
                    <Text color={theme.secondaryText} fontSize={13} fontWeight="500" marginBottom={4}>
                        {unit}
                    </Text>
                </View>
                <Text color={theme.secondaryText} fontSize={13}>
                    {label}
                </Text>
            </View>
        );
    }