import { StyleSheet } from "react-native";
import { colors, fontSize, radius, spacing } from "./theme";

export const commonStyles = StyleSheet.create({
    // Layout
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    // Text
    title: {
        fontSize: fontSize.xl,
        fontWeight: "600",
        color: colors.text,
    },
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textMuted,
    },

    // Inputs
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        fontSize: fontSize.md,
    },

    // Buttons
    button: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: "center",
    },
    buttonText: {
        color: colors.white,
        fontWeight: "600",
        fontSize: fontSize.md,
    },
});