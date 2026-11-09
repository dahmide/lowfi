import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db";

export const getBranchUrl = () => {
    const env = process.env.NODE_ENV ?? "development";
    if (env === "development") {
        return process.env.TEST_DATABASE_URL!;
    } else {
        return process.env.PROD_DATABASE_URL!;
    }
};

const path = getBranchUrl();
const pool = new Pool({
    connectionString: path,
});

export const db = drizzle(pool, { schema });
// export const db = drizzle(sql);
