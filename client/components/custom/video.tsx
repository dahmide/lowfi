"use client";

import { cn } from "@/lib/cn";
import { useMemo } from "react";

type MediaType = "image" | "video";

const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif",
    "bmp",
    "svg",
];
const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "m4v"];

function getMediaType(src: string, forcedType?: string): MediaType {
    const ext = (forcedType || src.split(".").pop() || "")
        .toLowerCase()
        .split("?")[0];

    if (VIDEO_EXTENSIONS.includes(ext)) return "video";
    return "image"; // jpg, png, gif, webp, etc. all go here
}

export function Media({
    src,
    alt = "Media",
    type,
    className,
    ...props
}: {
    src: string;
    alt?: string;
    type?: string;
    className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement> &
    React.VideoHTMLAttributes<HTMLVideoElement>) {
    const mediaType = useMemo(() => getMediaType(src, type), [src, type]);

    const sharedClassName = cn(
        "w-full h-full absolute top-0 left-0 object-cover z-0 mix-blend-screen",
        className
    );

    if (mediaType === "video") {
        return (
            <video
                src={src}
                aria-label={alt}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className={sharedClassName}
                {...(props as React.VideoHTMLAttributes<HTMLVideoElement>)}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={sharedClassName}
            {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
    );
}
