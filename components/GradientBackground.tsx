import { LinearGradient } from '@tamagui/linear-gradient';
import { ReactNode } from "react";

export default function GradientBackground({ children }: { children: ReactNode }) {
    return (
        <LinearGradient
            colors={["#1a1c20", "#111214"]}
            start={[0, 0]}
            end={[0.1, .3]}
            style={{ flex: 1 }}>
            {children}
        </LinearGradient>
    )
}