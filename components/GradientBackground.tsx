import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ReactNode } from "react";

export default function GradientBackground({ children }: { children: ReactNode }) {
    const {theme} = useTheme()
    return (
        <LinearGradient
            colors={[theme.surface, theme.background]}
            start={[0, 0]}
            end={[0.1, .3]}
            style={{ flex: 1 }}>
            {children}
        </LinearGradient>
    )
}