import { Server } from "socket.io";
import { httpServer } from "./server";

export const io = new Server(httpServer, {
    cors: { origin: process.env.ALLOWED_ORIGIN || "*" },
});
