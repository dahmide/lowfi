import { cn } from "@/lib/cn";
import { VariantProps, cva } from "class-variance-authority";
import Image from "next/image";

const logoVariants = cva("text-shadow", {
    variants: {
        size: {
            sm: "text-2xl",
            default: "text-4xl",
            lg: "text-6xl",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

export function Logo({
    className,
    size = "default",
    animateOnStart = false,
}: VariantProps<typeof logoVariants> & {
    className?: string;
    animateOnStart?: boolean;
}) {
    return (
        <div className={cn(logoVariants({ size, className }))}>
            <h1 className="">
                <span>Lowfi</span>
            </h1>
        </div>
    );
}
