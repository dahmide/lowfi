import { API_BASE } from "@/config/api";
import { StationDTO } from "../dto/stations.dto";

export async function getStation(
    id: string,
    direction?: "next" | "prev"
): Promise<StationDTO> {
    const url = direction
        ? `/api/stations/${id}/${direction}`
        : `/api/stations/${id}`;

    const res = await fetch(`${API_BASE}${url}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${url} (${res.status})`);
    }
    return res.json();
}

export async function getStations(): Promise<StationDTO[]> {
    const url = "/api/stations";
    const res = await fetch(`${API_BASE}${url}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${url} (${res.status})`);
    }
    return res.json();
}
