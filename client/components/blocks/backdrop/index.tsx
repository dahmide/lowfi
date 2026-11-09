"use client";

import {
    getOnlineScenes,
    getCustomScenes,
    setCustomScenes,
} from "@/lib/dal/scenes.dal";
import useSWR, { mutate } from "swr";
import { toast } from "@/components/ui/toast";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
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
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import Image from "next/image";
import { FileImageIcon, FileVideoIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type FileTypeProp = File["type"];
type Preview = {
    id: string;
    url: string;
    description: string;
};

const BACKGROUND_BYTES = 20 * 1024 * 1024;
const BACKGROUND_TYPES = [
    "image/gif",
    "image/webp",
    "image/png",
    "image/jpeg",
    "video/mp4",
    "video/webm",
] as const;

const createFile = () => {
    return `$${crypto.randomUUID()}`;
};

const verifyFile = (file: File) => {
    const isAllowedFile = BACKGROUND_TYPES.includes(
        file.type as (typeof BACKGROUND_TYPES)[number]
    );
    if (!isAllowedFile) {
        return "Use a GIF, WebP, PNG, JPEG, MP4 or WebM file.";
    }
    const isAllowedByte = file.size <= BACKGROUND_BYTES;
    if (!isAllowedByte) {
        const bytes = BACKGROUND_BYTES / 1024 / 1024;
        return `That file is too large. The limit is ${bytes} MB.`;
    }
    return null;
};

function ImagePreview({
    id,
    url,
    description,
    onClick,
}: Preview & {
    onClick?: () => void;
}) {
    return (
        <div
            className="relative aspect-video border border-border rounded-lg overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <Image
                src={url}
                alt={description}
                fill
                sizes="(min-width: 640px) 240px, 50vw"
                className="object-cover"
            />
        </div>
    );
}

function VideoPreview({
    id,
    url,
    description,
    poster,
    onClick,
}: Preview & {
    poster?: string;
    onClick?: () => void;
}) {
    const isUrlGif = url.toLowerCase().endsWith(".gif");
    const videoRef = useRef<HTMLVideoElement>(null);

    const { ref, inView } = useInView({
        threshold: 0.4,
        triggerOnce: false,
    });

    const setPlaying = (shouldPlay: boolean) => {
        const video = videoRef.current;
        if (!video || isUrlGif) return;

        if (shouldPlay) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    };

    useEffect(() => {
        setPlaying(inView);
    }, [inView, isUrlGif]);

    return (
        <div
            ref={ref}
            className="relative aspect-video border border-border rounded-lg overflow-hidden cursor-pointer"
            onMouseLeave={() => null}
            onMouseEnter={() => setPlaying(videoRef.current?.paused ?? false)}
            onClick={onClick}
        >
            {isUrlGif ? (
                <img
                    src={url}
                    alt={description}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <video
                    ref={videoRef}
                    src={url}
                    poster={poster}
                    aria-label={description}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
            )}
        </div>
    );
}

export default function Backdrop({
    open,
    onOpenChange,
    onFileChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileChange: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    const isMobile = useIsMobile();
    const position = isMobile ? "down" : "right";

    const [view, setView] = useState("motion");
    const { data: onlineScenes, error: onlineScenesError } = useSWR(
        "/online/bg",
        getOnlineScenes
    );
    const { data: customScenes, error: customScenesError } = useSWR(
        "/custom/bg",
        getCustomScenes
    );

    const uploadScene = async (files: File[]) => {
        const error = files.map(verifyFile).find(Boolean) ?? null;
        if (error) {
            // fire toast
            toast.add({
                title: "Upload fail",
                description: error,
            });
            return;
        }
        await setCustomScenes(files);
        mutate("/custom/bg");
    };

    const deleteScene = async (files: File[]) => {
        const error = files.map(verifyFile).find(Boolean) ?? null;
        if (error) {
            // fire toast
            return;
        }
        mutate("/custom/bg");
    };

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            swipeDirection={position}
            showSwipeHandle={isMobile}
        >
            <DrawerContent className="h-full m-0! p-0! border-l-2 border-border rounded-none">
                <Tabs
                    className="flex-1"
                    value={view}
                    onValueChange={setView}
                    orientation="horizontal"
                >
                    <DrawerHeader>
                        <DrawerTitle>Backgrounds</DrawerTitle>
                        <DrawerDescription>
                            Choose the background that plays behind your
                            station.
                        </DrawerDescription>
                        <div className="mt-4 flex flex-row items-center justify-between">
                            <TabsList className="w-full" variant="line">
                                <TabsTrigger value="motion">Motion</TabsTrigger>
                                <TabsTrigger value="static">Static</TabsTrigger>
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                            </TabsList>
                        </div>
                    </DrawerHeader>
                    <div className="px-4 py-0 no-scrollbar h-full flex-1 overflow-y-auto">
                        <TabsContent className="py-6" value="motion">
                            {onlineScenes?.motion.length ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {onlineScenes.motion.map((scene) => (
                                        <VideoPreview
                                            key={scene.id}
                                            onClick={() =>
                                                onFileChange(scene.url)
                                            }
                                            {...scene}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <FileVideoIcon />
                                        </EmptyMedia>
                                        <EmptyTitle>No data</EmptyTitle>
                                        <EmptyDescription>
                                            No data found
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            )}
                        </TabsContent>
                        <TabsContent className="py-6" value="static">
                            {onlineScenes?.static.length ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {onlineScenes.static.map((scene) => (
                                        <ImagePreview
                                            key={scene.id}
                                            onClick={() =>
                                                onFileChange(scene.url)
                                            }
                                            {...scene}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <FileImageIcon />
                                        </EmptyMedia>
                                        <EmptyTitle>No data</EmptyTitle>
                                        <EmptyDescription>
                                            No data found
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            )}
                        </TabsContent>
                        <TabsContent className="py-6" value="upload">
                            {customScenes?.length ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {customScenes.map((scene) => (
                                        <ImagePreview
                                            key={scene.id}
                                            onClick={() =>
                                                onFileChange(scene.url)
                                            }
                                            {...scene}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon"></EmptyMedia>
                                        <EmptyTitle>
                                            Add your own scene
                                        </EmptyTitle>
                                        <EmptyDescription>
                                            Upload a GIF, image or short video
                                            to use as your backdrop. Saved on
                                            this device only.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            )}
                        </TabsContent>
                    </div>
                    <DrawerFooter>
                        <div className="flex flex-row items-center justify-between">
                            <Field>
                                <Label className="cursor-pointer">
                                    Upload file
                                    <Input
                                        className="sr-only"
                                        type="file"
                                        multiple
                                        onChange={async (e) => {
                                            const files = Array.from(
                                                e.target.files ?? []
                                            );
                                            e.target.value = "";
                                            if (files.length === 0) return;
                                            await uploadScene(files);
                                        }}
                                    />
                                </Label>
                            </Field>
                        </div>
                    </DrawerFooter>
                </Tabs>
            </DrawerContent>
        </Drawer>
    );
}
