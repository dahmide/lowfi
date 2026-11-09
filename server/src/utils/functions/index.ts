import { ApiNowPlaying } from "@/types/azuracast";

export function normalizeStationPayload(
    station: any,
    nowPlaying: ApiNowPlaying | undefined
) {
    return {
        id: station.id,
        title: station.title,
        description: station.description,
        genre: station.genre,
        frequency: station.frequency,
        defaultUrl: station.snippets[0]?.bgAssetUrl,
        overlayUrl: station.snippets[0]?.overlay?.videoAssetUrl,
        dj: nowPlaying?.now_playing?.streamer ?? "AutoDJ",
        listen: nowPlaying?.station.listen_url,
        listeners: nowPlaying?.listeners?.current ?? 0,
    };
}

export function normalizeActivePayload(np: ApiNowPlaying) {
    return {
        id: np.station?.shortcode,
        listeners: np.listeners?.current ?? 0,
    };
}
