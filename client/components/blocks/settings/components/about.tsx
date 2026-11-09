import { useSettingsStore } from "@/stores/settings";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/custom/icon-badge";
import { Kbd } from "@/components/ui/kbd";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import { HOTKEYS } from "@/utils/constants";
import { CoffeeIcon } from "lucide-react";
import type { Social } from "@/types";

const SOCIALS = [
    { name: "Twitter", icon: null, link: "https://x.com/" },
    { name: "Github", icon: null, link: "https://github.com/" },
    { name: "Discord", icon: null, link: "https://discord.com/" },
] satisfies Array<Social>;

export default function SettingsAbout() {
    const {} = useSettingsStore();
    return (
        <div className="flex flex-col gap-4">
            <Card size="sm">
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <h2>Lowfi</h2>
                    <p>
                        A minimal lo-fi radio with live stations, animated
                        scenes and ambient sounds, made for studying, working or
                        winding down.
                    </p>
                </CardContent>
            </Card>
            {/*  */}
            <Card size="sm">
                <CardHeader>
                    <CardTitle>Links</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Button
                        className="h-auto p-2 gap-4"
                        variant="outline"
                        nativeButton={false}
                        render={<a href="" />}
                    >
                        <IconBadge className="size-10! shrink-0">
                            <CoffeeIcon />
                        </IconBadge>
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col gap-px">
                                <h3>Buy me a coffee</h3>
                                <p>Lorem, ipsum.</p>
                            </div>
                            {/* <ChevronsRightIcon /> */}
                        </div>
                    </Button>
                    <Button
                        className="h-auto p-2 gap-4"
                        variant="outline"
                        nativeButton={false}
                        render={<a href="" />}
                    >
                        <IconBadge className="size-10! shrink-0">
                            <CoffeeIcon />
                        </IconBadge>
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col gap-px">
                                <h3>Buy me a coffee</h3>
                                <p>Lorem, ipsum.</p>
                            </div>
                            {/* <ChevronsRightIcon /> */}
                        </div>
                    </Button>
                    <div className="flex flex-row items-center gap-4">
                        {SOCIALS.map((social) => (
                            <Button
                                className="flex-1"
                                variant="outline"
                                key={social.name}
                                nativeButton={false}
                                render={<a href="" />}
                            >
                                {social.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {/*  */}
            <Card size="sm">
                <CardHeader>
                    <CardTitle>Keyboard Shortcuts</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-0">
                    {HOTKEYS.map((hotkey) => (
                        <div
                            className="py-2 flex flex-row items-center justify-between border-b border-border last:border-b-0"
                            key={hotkey.id}
                        >
                            <span>{hotkey.label}</span>
                            <span>
                                <Kbd>{formatForDisplay(hotkey.displayKey)}</Kbd>
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
