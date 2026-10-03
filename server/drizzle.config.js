import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL IS NOT SET");

const config = defineConfig({
    strict: true,
    verbose: true,
    dialect: "postgresql",
    schema: "./src/db/schemas.ts",
    out: "./src/db/drizzle/migrations",
    dbCredentials: { url: process.env.DATABASE_URL }
});

export default config;
