import { getStore } from "@/lib/indexeddb";
import { getFiles, setFiles } from "@/lib/upload";

const store = getStore("scenes");

export async function getOnlineScenes() {
    const scenes = {
        // TODO: Placeholders images for now, to be swapped for GIF/WebM files later.
        motion: [
            {
                id: "alpine-motion",
                url: "https://images.unsplash.com/photo-1548679847-1d4ff48016c7?auto=format&fit=crop&w=1200&q=85",
                description: "Fabrizio Conti",
            },
            {
                id: "ocean-motion",
                url: "https://images.unsplash.com/photo-1468657988500-aca2be09f4c6?auto=format&fit=crop&w=1200&q=85",
                description: "Mike Iukhtenko",
            },
            {
                id: "forest-motion",
                url: "https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?auto=format&fit=crop&w=1200&q=85",
                description: "Inggrid Koe",
            },
        ],

        static: [
            {
                id: "alpine",
                url: "https://images.unsplash.com/photo-1548679847-1d4ff48016c7?auto=format&fit=crop&w=1200&q=85",
                description: "Fabrizio Conti",
            },
            {
                id: "dunes",
                url: "https://images.unsplash.com/photo-1621795307430-3ff25aa08945?auto=format&fit=crop&w=1200&q=85",
                description: "Ze Paulo",
            },
            {
                id: "forest",
                url: "https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?auto=format&fit=crop&w=1200&q=85",
                description: "Inggrid Koe",
            },
            {
                id: "ocean",
                url: "https://images.unsplash.com/photo-1468657988500-aca2be09f4c6?auto=format&fit=crop&w=1200&q=85",
                description: "Mike Iukhtenko",
            },
            {
                id: "structure",
                url: "https://images.unsplash.com/photo-1619857121838-997e82345250?auto=format&fit=crop&w=1200&q=85",
                description: "Rufat Mammadov",
            },
            {
                id: "coast",
                url: "https://images.unsplash.com/photo-1708022807069-cb713b6894d5?auto=format&fit=crop&w=1200&q=85",
                description: "Nicholas Bullett",
            },
        ],
    };
    return scenes;
}

export async function getCustomScenes() {
    try {
        const scenes = await getFiles(store);
        return scenes.map((scene) => ({
            id: scene.id as string,
            url: URL.createObjectURL(scene.file),
            description: "",
        }));
    } catch {
        return [];
    }
}

export async function setCustomScenes(files: File[]) {
    try {
        const scenes = await setFiles(files, store);
        return scenes;
    } catch {
        return [];
    }
}
