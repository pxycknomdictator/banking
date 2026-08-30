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
    account: {
        storeStateStrategy: "database",
        accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            trustedProviders: ["google", "github", "discord", "email-password"],
        },
    },
    verification: { storeIdentifier: "hashed", storeInDatabase: false },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            mapProfileToUser: async (profile) => ({
                name: profile.given_name,
                email: profile.email,
                emailVerified: profile.email_verified,
                image: profile.picture,
            }),
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            mapProfileToUser: async (profile) => ({
                name: profile.login,
                email: profile.email,
                emailVerified: Boolean(profile.email),
                image: profile.avatar_url,
            }),
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            mapProfileToUser: async (profile) => ({
                name: profile.global_name || profile.username,
                email: profile.email,
                emailVerified: profile.verified,
                image: profile.image_url,
            }),
        },
    },
    plugins: [nextCookies()],
});
