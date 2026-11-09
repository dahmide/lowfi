import { API_BASE } from "@/config/api";
import { AmbienceVisualDTO } from "../dto/ambience-visual.dto";

export async function getAmbienceVisuals(): Promise<AmbienceVisualDTO[]> {
    const url = "/api/ambience/effects";
    const res = await fetch(`${API_BASE}${url}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${url} (${res.status})`);
    }
    return res.json();
}
