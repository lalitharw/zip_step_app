import { LinearGradient } from "@tamagui/linear-gradient"
import { ReactNode } from "react"
import { Pressable } from "react-native"
import { Text } from "tamagui"

type Props = {
    onPress: () => void
    disabled?: boolean
    children: ReactNode
}

export default function GradientButton({ onPress, disabled, children }: Props) {
    return (
        <Pressable onPress={onPress} disabled={disabled} style={{ width: "100%", opacity: disabled ? 0.6 : 1 }}>
            <LinearGradient
                colors={["#227f90", "#113f41"]}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Text color="white" fontWeight="600" fontSize="$4">
                    {children}
                </Text>
            </LinearGradient>
        </Pressable>
    )
}