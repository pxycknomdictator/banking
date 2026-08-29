import { defineConfig } from "drizzle-kit";

const config = defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/drizzle",
    dbCredentials: { url: process.env.DATABASE_URL as string },
    strict: true,
    verbose: true,
});

export default config;
