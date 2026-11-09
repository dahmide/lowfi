"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { StationDTO } from "@/lib/dto/stations.dto";
import { getStations } from "@/lib/dal/stations.dal";
import { useIsMobile } from "@/hooks/use-mobile";
import { stringToColor } from "@/utils/functions";
import { Button } from "@/components/ui/button";
import { Grid2x2Icon as GridIcon, ListIcon, RadioIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Selector({
    open,
    onOpenChange,
    station,
    changeStation,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    station: StationDTO;
    changeStation: (id: string) => void;
}) {
    const isMobile = useIsMobile();
    const position = isMobile ? "down" : "right";

    const [view, setView] = useState("grid");
    const [list, setList] = useState<StationDTO[]>([]);

    const { data: stations } = useSWR("/api/stations", getStations, {
        fallbackData: [],
    });
    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            swipeDirection={position}
            showSwipeHandle={isMobile}
        >
            <DrawerContent className="h-full m-0! p-0! border-l-2 border-border rounded-none">
                <Tabs
                    className=""
                    value={view}
                    onValueChange={setView}
                    orientation="horizontal"
                >
                    <DrawerHeader>
                        <DrawerTitle>Stations</DrawerTitle>
                        <DrawerDescription>
                            Choose a station to listen to.
                        </DrawerDescription>
                        <div className="flex flex-row items-center justify-between">
                            <span>{stations.length} stations</span>
                            <TabsList variant="line">
                                <TabsTrigger value="grid">
                                    <GridIcon />
                                </TabsTrigger>
                                <TabsTrigger value="list">
                                    <ListIcon />
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </DrawerHeader>
                    <div className="px-4 py-0 no-scrollbar h-full overflow-y-auto">
                        <TabsContent
                            className="grid grid-cols-2 gap-4"
                            value="grid"
                        >
                            {stations.map((s) => (
                                <Button
                                    key={s.id}
                                    onClick={() => changeStation(s.id)}
                                    className="group/card h-36 p-1 flex flex-col items-stretch gap-2 text-left rounded-lg overflow-hidden bg-muted/50 hover:bg-muted/50"
                                    data-open={
                                        s.id === station.id ? "" : undefined
                                    }
                                    style={{ "--bg": stringToColor(s.title) }}
                                >
                                    <div className="flex-1 shrink-0 flex flex-col items-center justify-center rounded-sm overflow-hidden card">
                                        <RadioIcon className="size-8" />
                                    </div>
                                    <div className="flex-0 shrink-0 flex flex-col">
                                        <h3>{s.title}</h3>
                                        <p>{s.genre}</p>
                                    </div>
                                </Button>
                            ))}
                        </TabsContent>
                        <TabsContent
                            className="grid grid-cols-1 gap-4"
                            value="list"
                        >
                            {stations.map((s) => (
                                <Button
                                    key={s.id}
                                    onClick={() => changeStation(s.id)}
                                    className="group/card h-36 p-1 flex flex-row items-stretch gap-4 text-left rounded-lg overflow-hidden bg-muted/50 hover:bg-muted/50"
                                    data-open={
                                        s.id === station.id ? "" : undefined
                                    }
                                    style={{ "--bg": stringToColor(s.title) }}
                                >
                                    <div className="flex-1 shrink-0 flex flex-col items-center justify-center rounded-sm overflow-hidden card">
                                        <RadioIcon className="size-8" />
                                    </div>
                                    <div className="flex-2 shrink-0 flex flex-col">
                                        <h3>{s.title}</h3>
                                        <p>{s.genre}</p>
                                    </div>
                                </Button>
                            ))}
                        </TabsContent>
                    </div>
                    <DrawerFooter>
                        <div></div>
                    </DrawerFooter>
                </Tabs>
            </DrawerContent>
        </Drawer>
    );
}
