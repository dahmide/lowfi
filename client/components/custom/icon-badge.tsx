import { cn } from "cn";
import React from "react";

export function IconBadge({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "size-10 flex items-center justify-center border border-border rounded-full bg-muted text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
