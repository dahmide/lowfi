import { Api } from "@/types/azuracast";

export const azuracastApi = new Api<string>({
    baseUrl: `${process.env.AZURACAST_API_URL}/api`,
    securityWorker: (apiKey) => {
        if (!apiKey) return;
        return {
            headers: {
                "X-API-Key": apiKey,
            },
        };
    },
});

azuracastApi.setSecurityData(process.env.AZURACAST_API_KEY ?? null);
