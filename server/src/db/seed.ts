import "dotenv/config";
import { db } from "@/lib/db";
import { scenes, sounds, stations } from ".";

const R2 = "https://pub-905052c9549b45b580eafec615ec4659.r2.dev";

const STREAM_BASE_URL = process.env.STREAM_BASE_URL;
if (!STREAM_BASE_URL) throw new Error("STREAM_BASE_URL is not set");

const streamUrl = (id: string) => `${STREAM_BASE_URL}/listen/${id}/radio.mp3`;

async function seed() {
    await db
        .insert(stations)
        .values([
            {
                id: "study",
                title: "Bounce FM",
                label: "Bounce",
                genre: "Lofi Hiphop",
                streamUrl: streamUrl("study"),
                frequency: 101.1,
                sortOrder: 1,
            },
            {
                id: "jazz",
                title: "Velvet FM",
                label: "Velvet",
                genre: "Nu Jazz",
                streamUrl: streamUrl("jazz"),
                frequency: 93.7,
                sortOrder: 2,
            },
            {
                id: "sleep",
                title: "Colour FM",
                label: "Colour",
                genre: "Ambient/Drone",
                streamUrl: streamUrl("sleep"),
                frequency: 88.3,
                sortOrder: 3,
            },
            {
                id: "dance",
                title: "Cellar FM",
                label: "Cellar",
                genre: "Lofi House",
                streamUrl: streamUrl("dance"),
                frequency: 107.9,
                sortOrder: 4,
            },
            {
                id: "arcade",
                title: "Arcade FM",
                label: "Arcade",
                genre: "Vaporwave",
                streamUrl: streamUrl("arcade"),
                frequency: 97.5,
                sortOrder: 5,
            },
            {
                id: "shrine",
                title: "Shrine FM",
                label: "Shrine",
                genre: "Afrobeat",
                streamUrl: streamUrl("shrine"),
                frequency: 104.5,
                sortOrder: 6,
            },
        ])
        .onConflictDoNothing();

    await db
        .insert(sounds)
        .values([
            {
                id: "rain",
                category: "atmos",
                label: "Rain",
                url: `${R2}/sounds/rain.mp3`,
            },
            {
                id: "city",
                category: "atmos",
                label: "City",
                url: `${R2}/sounds/urban.mp3`,
            },
            {
                id: "waves",
                category: "atmos",
                label: "Waves",
                url: `${R2}/sounds/rain.mp3`,
            },
            {
                id: "storm",
                category: "atmos",
                label: "Storm",
                url: `${R2}/sounds/urban.mp3`,
            },
            {
                id: "snow",
                category: "atmos",
                label: "Snow",
                url: `${R2}/sounds/urban.mp3`,
            },
        ])
        .onConflictDoNothing();

    await db
        .insert(scenes)
        .values([
            {
                stationId: "study",
                category: "motion",
                label: "Study 1",
                isDefault: true,
                url: `${R2}/scenes/study/study_20260901.mp4`,
            },
            {
                stationId: "study",
                category: "motion",
                label: "Study 2",
                url: `${R2}/scenes/study/study_20260902.mp4`,
            },
            {
                stationId: "jazz",
                category: "motion",
                label: "Jazz 1",
                isDefault: true,
                url: `${R2}/scenes/jazz/jazz_20260901.mp4`,
            },
            {
                stationId: "jazz",
                category: "motion",
                label: "Jazz 2",
                url: `${R2}/scenes/jazz/jazz_20260902.mp4`,
            },
            {
                stationId: "sleep",
                category: "motion",
                label: "Sleep 1",
                isDefault: true,
                url: `${R2}/scenes/sleep/sleep_20260901.mp4`,
            },
            {
                stationId: "sleep",
                category: "motion",
                label: "Sleep 2",
                url: `${R2}/scenes/sleep/sleep_20260902.mp4`,
            },
            {
                stationId: "dance",
                category: "motion",
                label: "Dance 1",
                isDefault: true,
                url: `${R2}/scenes/dance/dance_20260901.mp4`,
            },
            {
                stationId: "dance",
                category: "motion",
                label: "Dance 2",
                url: `${R2}/scenes/dance/dance_20260902.mp4`,
            },
        ])
        .onConflictDoNothing();

    console.log("Seed complete");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
