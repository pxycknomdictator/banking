import { db } from "@/db";
import { passwords } from "@/lib/passwords";
import { redis } from "@/lib/redis";
import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    appName: "banking",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        password: {
            async hash(password) {
                return await passwords.hash(password);
            },
            async verify({ hash, password }) {
                return await passwords.verify(hash, password);
            }
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        transaction: true
    }),
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            trustedProviders: ["google", "github", "discord", "email-password"]
        }
    },
    secondaryStorage: redisStorage({
        client: redis,
        keyPrefix: "better-auth:"
    }),
    plugins: [nextCookies()]
});
