import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";

export const auth = betterAuth({
    appName: "banking",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        resetPasswordTokenExpiresIn: 60 * 5,
        revokeSessionsOnPasswordReset: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        transaction: true,
    }),
    emailVerification: { expiresIn: 60 * 5 },
    plugins: [nextCookies()],
});
