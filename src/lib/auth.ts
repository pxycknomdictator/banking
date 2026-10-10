import { db } from "@/db";
import { redis } from "@lib/redis";
import { passkey } from "@better-auth/passkey";
import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { hash, verify } from "@lib/password";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, lastLoginMethod, twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
    appName: "banking",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    verification: { storeIdentifier: "hashed", storeInDatabase: true },
    database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
    secondaryStorage: redisStorage({
        client: redis,
        keyPrefix: "better-auth:"
    }),
    session: {
        expiresIn: 60 * 60,
        storeSessionInDatabase: true,
        preserveSessionInDatabase: false
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
        disableCSRFCheck: false,
        disableOriginCheck: false,
        database: { generateId: "uuid", validateSchema: true }
    },
    emailAndPassword: {
        enabled: true,
        resetPasswordTokenExpiresIn: 60 * 5,
        revokeSessionsOnPasswordReset: true,
        password: {
            hash: async (password) => await hash(password),
            verify: async ({ hash, password }) => await verify(hash, password)
        }
    },
    account: {
        storeStateStrategy: "database",
        accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            trustedProviders: ["email-password", "google", "github", "discord"]
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string
        }
    },
    plugins: [admin(), lastLoginMethod(), twoFactor(), passkey(), nextCookies()]
});
