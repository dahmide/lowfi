"use client";

import { useMemo } from "react";

export interface DeviceLocation {
    timezone: string;
    city: string | null;
    region: string | null;
    formatted: string;
    loading: boolean;
    error: string | null;
}

const TIMEZONE_CITY_MAP: Record<string, string> = {
    "Africa/Lagos": "Lagos",
    "Africa/Cairo": "Cairo",
    "Africa/Johannesburg": "Johannesburg",
    "Africa/Nairobi": "Nairobi",
    "Africa/Casablanca": "Casablanca",
    "Africa/Accra": "Accra",
    "Africa/Addis_Ababa": "Addis Ababa",
    "Europe/London": "London",
    "Europe/Paris": "Paris",
    "Europe/Berlin": "Berlin",
    "Europe/Madrid": "Madrid",
    "Europe/Rome": "Rome",
    "Europe/Amsterdam": "Amsterdam",
    "Europe/Moscow": "Moscow",
    "Europe/Istanbul": "Istanbul",
    "Europe/Athens": "Athens",
    "Europe/Stockholm": "Stockholm",
    "Europe/Zurich": "Zurich",
    "Europe/Vienna": "Vienna",
    "Europe/Warsaw": "Warsaw",
    "Europe/Dublin": "Dublin",
    "Europe/Lisbon": "Lisbon",
    "Europe/Brussels": "Brussels",
    "Europe/Prague": "Prague",
    "Europe/Budapest": "Budapest",
    "Europe/Helsinki": "Helsinki",
    "Europe/Oslo": "Oslo",
    "Europe/Copenhagen": "Copenhagen",
    "America/New_York": "New York",
    "America/Chicago": "Chicago",
    "America/Denver": "Denver",
    "America/Los_Angeles": "Los Angeles",
    "America/Toronto": "Toronto",
    "America/Vancouver": "Vancouver",
    "America/Mexico_City": "Mexico City",
    "America/Sao_Paulo": "São Paulo",
    "America/Buenos_Aires": "Buenos Aires",
    "America/Bogota": "Bogotá",
    "America/Lima": "Lima",
    "America/Santiago": "Santiago",
    "America/Caracas": "Caracas",
    "America/Phoenix": "Phoenix",
    "America/Anchorage": "Anchorage",
    "America/Honolulu": "Honolulu",
    "America/Detroit": "Detroit",
    "America/Indiana/Indianapolis": "Indianapolis",
    "America/Kentucky/Louisville": "Louisville",
    "Asia/Dubai": "Dubai",
    "Asia/Kolkata": "Kolkata",
    "Asia/Tokyo": "Tokyo",
    "Asia/Shanghai": "Shanghai",
    "Asia/Singapore": "Singapore",
    "Asia/Hong_Kong": "Hong Kong",
    "Asia/Seoul": "Seoul",
    "Asia/Bangkok": "Bangkok",
    "Asia/Jakarta": "Jakarta",
    "Asia/Manila": "Manila",
    "Asia/Kuala_Lumpur": "Kuala Lumpur",
    "Asia/Taipei": "Taipei",
    "Asia/Jerusalem": "Jerusalem",
    "Asia/Riyadh": "Riyadh",
    "Asia/Tehran": "Tehran",
    "Asia/Baghdad": "Baghdad",
    "Asia/Karachi": "Karachi",
    "Asia/Dhaka": "Dhaka",
    "Asia/Colombo": "Colombo",
    "Asia/Kathmandu": "Kathmandu",
    "Asia/Yangon": "Yangon",
    "Asia/Ho_Chi_Minh": "Ho Chi Minh City",
    "Australia/Sydney": "Sydney",
    "Australia/Melbourne": "Melbourne",
    "Australia/Brisbane": "Brisbane",
    "Australia/Perth": "Perth",
    "Australia/Adelaide": "Adelaide",
    "Pacific/Auckland": "Auckland",
    "Pacific/Fiji": "Fiji",
    "Pacific/Honolulu": "Honolulu",
    "Pacific/Guam": "Guam",
    UTC: "UTC",
    "Etc/UTC": "UTC",
    "Etc/GMT": "GMT",
};

function getFriendlyName(timezone: string): {
    city: string;
    region: string | null;
} {
    if (TIMEZONE_CITY_MAP[timezone]) {
        return { city: TIMEZONE_CITY_MAP[timezone], region: null };
    }

    const parts = timezone.split("/");
    const last = parts[parts.length - 1] || timezone;
    const city = last.replace(/_/g, " ");

    const region =
        parts.length >= 2 && parts[0] !== "Etc" && parts[0] !== "UTC"
            ? parts[parts.length - 2]?.replace(/_/g, " ") ?? null
            : null;

    return { city, region };
}

export function useLocation(): DeviceLocation {
    return useMemo(() => {
        let timezone = "UTC";

        try {
            timezone =
                Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        } catch {
            timezone = "UTC";
        }

        const { city, region } = getFriendlyName(timezone);

        const formatted =
            region && region !== city ? `${city}, ${region}` : city;

        return {
            timezone,
            city,
            region,
            formatted,
            loading: false,
            error: null,
        };
    }, []);
}
