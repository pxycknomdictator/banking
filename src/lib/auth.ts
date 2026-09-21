import { db } from "@/db";
import { sendEmail } from "@/lib/email";
import { passwords } from "@/lib/passwords";
import { redis } from "@/lib/redis";
import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, lastLoginMethod, twoFactor } from "better-auth/plugins";

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
        },
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 5,
        revokeSessionsOnPasswordReset: true,
        async sendResetPassword({ user, url }) {
            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: `Click the link to reset your password: ${url}`
            });
        }
    },
    emailVerification: {
        expiresIn: 60 * 5,
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        async sendVerificationEmail({ user, url }) {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                html: `Click the link to verify your email: ${url}`
            });
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
    session: {
        expiresIn: 60 * 60 * 24,
        storeSessionInDatabase: true,
        preserveSessionInDatabase: false
    },
    verification: { storeIdentifier: "hashed", storeInDatabase: true },
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
    plugins: [admin(), twoFactor(), lastLoginMethod(), nextCookies()]
});
