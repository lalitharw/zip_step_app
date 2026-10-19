export function formatPace(rawPace: number) {
  if (!Number.isFinite(rawPace) || rawPace <= 0) {
    return "--:--";
  }

  const totalSeconds = Math.round(rawPace);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}