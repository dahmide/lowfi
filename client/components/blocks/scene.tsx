import { cn } from "@/lib/cn";
import { Media } from "../custom/video";
import { EffectOverlay } from "./_layers";
import { useSettingsStore } from "@/stores/settings";

export default function Scene({
    url,
    children,
    className,
}: {
    url: string;
    children: React.ReactNode;
    className?: string;
}) {
    const effect = "vhs"
    console.log("Effect: ", effect)
    return (
        <section className={cn("flex-1 flex flex-col relative", className)}>
            <EffectOverlay effect={effect}>
                <Media src={url} alt="Scene" />
            </EffectOverlay>
            {children}
        </section>
    );
}
