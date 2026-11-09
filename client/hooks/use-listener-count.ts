import { useEffect, useState } from "react";
import { getSocket } from "@/lib/io";

type ListenerCountUpdate = {
    id: string;
    listeners: number;
};

export function useListenerCount(stationId: string | null) {
    const [listeners, setListeners] = useState<number | null>(null);

    useEffect(() => {
        if (!stationId) return;

        setListeners(null);
        const s = getSocket();

        function handler(data: ListenerCountUpdate) {
            setListeners(data.listeners);
        }

        s.emit("subscribe", stationId);
        s.on(`listeners:${stationId}`, handler);

        return () => {
            s.off(`listeners:${stationId}`, handler);
            s.emit("unsubscribe", stationId);
        };
    }, [stationId]);
    return listeners;
}
