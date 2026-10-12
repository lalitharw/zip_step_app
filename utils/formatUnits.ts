export function formatPace(rawPace: number) {
    if (!Number.isFinite(rawPace) || rawPace <= 0) return "--:--"
    const totalSecondsPerKm = rawPace / 1000;
    const minutes = Math.floor(totalSecondsPerKm / 60);
    const seconds = Math.round(totalSecondsPerKm % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;

}