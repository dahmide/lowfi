"use client";

import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsAbout, SettingsPrefs, SettingsSound } from "./components";

export default function Settings({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [tab, setTab] = useState("sound");
    return (
        <Dialog open={open} modal={true} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-[90%] sm:max-w-[50vw]">
                <Tabs
                    className=""
                    value={tab}
                    onValueChange={(v) => setTab(v)}
                    orientation="horizontal"
                >
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <TabsList
                            className="w-full px-0 bg-transparent border-y border-y-border rounded-none"
                            variant="line"
                        >
                            <TabsTrigger
                                className="border-none rounded-none data-active:bg-muted"
                                value="sound"
                            >
                                Sound
                            </TabsTrigger>
                            <TabsTrigger
                                className="border-none rounded-none data-active:bg-muted"
                                value="prefs"
                            >
                                Preferences
                            </TabsTrigger>
                            <TabsTrigger
                                className="border-none rounded-none data-active:bg-muted"
                                value="about"
                            >
                                About
                            </TabsTrigger>
                        </TabsList>
                    </DialogHeader>
                    <div className="min-h-[64vh] max-h-[50vh] -mx-4 px-4 py-4 overflow-y-auto no-scrollbar">
                        <TabsContent
                            className="w-full flex flex-col"
                            value="sound"
                        >
                            <SettingsSound />
                        </TabsContent>
                        <TabsContent
                            className="w-full flex flex-col"
                            value="prefs"
                        >
                            <SettingsPrefs />
                        </TabsContent>
                        <TabsContent
                            className="w-full flex flex-col"
                            value="about"
                        >
                            <SettingsAbout />
                        </TabsContent>
                    </div>
                    <DialogFooter>
                        <div className="text-center">
                            <span>Version 0.1.0</span>
                        </div>
                    </DialogFooter>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
