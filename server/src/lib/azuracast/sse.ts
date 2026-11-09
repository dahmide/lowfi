import { EventSource } from "eventsource";
import type { Server as SocketIOServer } from "socket.io";
import { db } from "@/lib/db";
import { stations } from "@/db";
import { AZURACAST_API_URL } from "@/config/api";

const BASE_URL = AZURACAST_API_URL;

function shapeNowPlaying(np: any) {
    return {
        id: np.station?.shortcode,
        listeners: np.listeners?.current ?? 0,
    };
}

async function getStationIds() {
    const rows = await db.select({ id: stations.id }).from(stations);
    return rows.map(({ id }) => id);
}

function formatSseAddress(
    stationIds: string[]
) {
    const topics = Object.fromEntries(
        stationIds.map((id) => [`station:${id}`, { recover: true }])
    );
    const params = new URLSearchParams({
        cf_connect: JSON.stringify({ subs: topics }),
    });
    return `${BASE_URL}/api/live/nowplaying/sse?${params}`;
}

function handleSseMessage(
    data: string, 
    io: SocketIOServer
) {
    const message = JSON.parse(data);

    if ("connect" in message) {
        handleSseConnect(message.connect, io);
    } else if ("pub" in message) {
        handleSsePayload(message.pub, io);
    }
}

function handleSseConnect(
    connect: any, 
    io: SocketIOServer
) {
    if ("data" in connect) {
        connect.data.forEach((row: any) => handleSsePayload(row, io));
        return;
    }
    for (const sub of Object.values(connect.subs ?? {}) as any[]) {
        if (!Array.isArray(sub.publications)) continue;
        sub.publications.forEach((row: any) => handleSsePayload(row, io));
    }
}

function handleSsePayload(
    payload: { data: { np?: any } }, 
    io: SocketIOServer
) {
    const np = payload.data?.np;
    if (!np) return;

    const shaped = shapeNowPlaying(np);
    io.to(`station:${shaped.id}`).emit(`listeners:${shaped.id}`, shaped);
}

export async function startAzuracastRelay(io: SocketIOServer) {
    const stationIds = await getStationIds();

    if (stationIds.length === 0) {
        console.warn("No stations found in DB -- AzuraCast relay not started.");
    } else {
        const sseUrl = formatSseAddress(stationIds);
        const sseSrc = new EventSource(sseUrl);
        
        sseSrc.onmessage = (event) => {
            try {
                handleSseMessage(event.data, io);
            } catch (err) {
                console.error("Failed to parse AzuraCast SSE message:", err);
            }
        };
        return sseSrc;
    }
}
