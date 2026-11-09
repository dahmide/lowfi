import Home from "@/components/pages/home";
import { getAmbienceEffects } from "@/lib/dal/ambience-effects.dal";
import { getAmbienceVisuals } from "@/lib/dal/ambience-visuals.dal";
import { getStation } from "@/lib/dal/stations.dal";

export default async function Page() {
    const [station, ambienceEffects, ambienceVisuals] = await Promise.all([
        getStation("study"),
        getAmbienceEffects(),
        getAmbienceVisuals(),
    ]);
    return (
        <Home
            initialStation={station}
            initialAmbienceEffects={ambienceEffects}
            initialAmbienceVisuals={ambienceVisuals}
        />
    );
}
