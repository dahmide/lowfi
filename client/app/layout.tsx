import type { Metadata } from "next";
import { DM_Sans, Caveat, Kalam } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

const departureMono = localFont({
    src: "../public/fonts/DepartureMono.woff2",
    variable: "--ff-body",
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            data-accent="red"
            className={cn("h-full antialiased", departureMono.variable)}
        >
            <body className="min-h-full flex flex-col">
                {children}
                <Toaster />
            </body>
        </html>
    );
}
