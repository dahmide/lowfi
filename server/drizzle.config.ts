import { config } from "dotenv";
config({ path: ".env" });

import { getBranchUrl } from "./src/lib/db";
import { defineConfig } from "drizzle-kit";

const branchUrl = getBranchUrl();
if (!branchUrl) {
    throw new Error("DATABASE_URL is not set in .env.local");
}

export default defineConfig({
    schema: "./src/db/index.ts", // Your schema file path
    out: "./drizzle", // Your migrations folder
    dialect: "postgresql",
    dbCredentials: {
        url: branchUrl,
    },
});
