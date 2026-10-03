import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas.js";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL IS NOT SET");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const db = drizzle({ client: pool, schema });
