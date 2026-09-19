import { defineConfig } from "drizzle-kit";

const config = defineConfig({
    strict: true,
    verbose: true,
    dialect: "postgresql",
    out: "./src/db/migration",
    schema: "./src/db/schemas.ts",
    dbCredentials: { url: process.env.DATABASE_URL! }
});

export default config;
