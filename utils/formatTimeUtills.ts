export function formatTime(milliseconds: number) {
    if (!Number.isFinite(milliseconds)) return "00:00:00"
    
    const totalSeconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function milliSecondsToMinutes(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return minutes
}

export function formatDateLocale(dateInput: string | number | Date) {
    const date = new Date(dateInput)

    const dateStr = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
    return dateStr;
}

export function formatTimeLocate(dateInput: string | number | Date) {
    const date = new Date(dateInput)

    const timeStr = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        
        
    });

    return timeStr
}