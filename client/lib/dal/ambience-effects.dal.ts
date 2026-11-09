import { API_BASE } from "@/config/api";
import { AmbienceEffectDTO } from "../dto/ambience-effect.dto";

export async function getAmbienceEffects(): Promise<AmbienceEffectDTO[]> {
    const url = "/api/ambience/effects";
    const res = await fetch(`${API_BASE}${url}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${url} (${res.status})`);
    }
    return res.json();
}
