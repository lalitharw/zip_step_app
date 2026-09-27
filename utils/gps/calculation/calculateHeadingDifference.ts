export function calculateHeadingDifference(previousHeading: number, currentHeading: number) {
    const difference = Math.abs(currentHeading - previousHeading)

    return Math.min(
        difference, 360 - difference
    )
}