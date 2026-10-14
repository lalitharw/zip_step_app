import { getCurrentActivityId } from "@/utils/activity";
import { getActivityElapsedTime } from "@/utils/ActivityElapsedTime";
import { useEffect, useRef, useState } from "react";

type ActivityTimerProps = {
    isRecording: boolean;
    isPaused: boolean;
};

export const useActivityTimer = ({ isRecording, isPaused }: ActivityTimerProps) => {
    const [baseElapsed, setBaseElapsed] = useState(0);   // restored/accumulated ms
    const [now, setNow] = useState(Date.now());
    const runStartRef = useRef<number | null>(null);
    const [isRestored, setIsRestored] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const id = await getCurrentActivityId();
                if (id) setBaseElapsed((await getActivityElapsedTime(id)) ?? 0);
            } finally {
                setIsRestored(true);
            }
        })();
    }, []);

    const running = isRestored && isRecording && !isPaused;

    useEffect(() => {
        if (!running) {
            if (runStartRef.current !== null) {
                setBaseElapsed(e => e + Date.now() - runStartRef.current!);
                runStartRef.current = null;
            }
            return;
        }
        runStartRef.current = Date.now();
        setNow(Date.now());
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [running]);

    return baseElapsed + (running && runStartRef.current ? now - runStartRef.current : 0);
};
