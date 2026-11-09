import express, { type Express } from "express";
import { createServer } from "http";

export const app: Express = express();
export const httpServer = createServer(app);
