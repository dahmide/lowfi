import "dotenv/config";
import type { NextFunction, Request, Response } from "express";
import { app, httpServer } from "@/lib/server";
import { io } from "@/lib/socket";
import { ambienceRouter, stationsRouter } from "@/routes";
import { PORT } from "@/config/api";
import { startAzuracastRelay } from "@/lib/azuracast/sse";
import { SOCKET_ACTIONS } from "@/utils/constants";
import cors from "cors";

app.use(cors({ origin: true, credentials: true }));

app.use("/api/ambience", ambienceRouter);
app.use("/api/stations", stationsRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

io.on("connection", (socket) => {
    console.log("Frontend connected:", socket.id);

    socket.on(SOCKET_ACTIONS.attach, (stationId: string) => {
        socket.join(`station:${stationId}`);
    });

    socket.on(SOCKET_ACTIONS.detach, (stationId: string) => {
        socket.leave(`station:${stationId}`);
    });

    socket.on("disconnect", () =>
        console.log("Frontend disconnected:", socket.id)
    );
});

await startAzuracastRelay(io);

// ---------------------------------------------
//
// ---------------------------------------------
app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
