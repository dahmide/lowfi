import useSWR from "swr";
import { StationDTO } from "@/lib/dto/stations.dto";
import { getStation } from "@/lib/dal/stations.dal";
import { useCallback, useState } from "react";

export function useStation(station: StationDTO) {
    const [isLoading, setIsLoading] = useState(false);
    const { data: channel, mutate } = useSWR<StationDTO>(station.id, null, {
        fallbackData: station,
    });

    const changeStation = useCallback(
        async (id: string, direction?: "next" | "prev") => {
            setIsLoading(true);
            try {
                const result = await getStation(id, direction);
                mutate(result, {
                    revalidate: false,
                    rollbackOnError: true,
                });
            } catch (error) {
                console.error("Error: ", error);
            } finally {
                setIsLoading(false);
            }
        },
        [mutate]
    );

    return {
        station: channel!,
        changeStation,
        isTuning: isLoading,
    };
}
