export function formatPace(rawPace: number) {
  if (!Number.isFinite(rawPace) || rawPace <= 0) {
    return "--:--";
  }

  const totalSeconds = Math.round(rawPace);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}



export const formatDate = (ms: string | number | undefined) => {
  return new Date(ms ?? 0).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}


export const formatTime = (ms: string | number) => {
  return new Date(ms ?? 0).toLocaleTimeString('en-IN',{hour:"2-digit",minute:"2-digit", hour12:true})
}