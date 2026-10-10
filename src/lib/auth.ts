import { db } from "@/db";
import { redis } from "@lib/redis";
import { sendEmail } from "@lib/email";
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
        },
        async sendResetPassword({ user, url }) {
            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: `Click the link to reset your password: ${url}<br/><br/>This link expires in 5 minutes.`
            });
        }
    },
    emailVerification: {
        expiresIn: 60 * 5,
        async sendVerificationEmail({ user, url }) {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                html: `Click the link to verify your email: ${url}<br/><br/>This link expires in 5 minutes.`
            });
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
    user: {
        additionalFields: {
            role: {
                input: false,
                required: false,
                defaultValue: "user",
                type: ["user", "admin"]
            }
        },
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: false,
            async sendChangeEmailConfirmation({ user, url, newEmail }) {
                void sendEmail({
                    to: newEmail,
                    subject: "Confirm your email change",
                    html: `Hi ${user.name},<br/><br/>You requested to change your email address.<br/><br/>Current email: ${user.email}<br/>New email: ${newEmail}<br/><br/>Click the link below to confirm your email change:<br/>${url}<br/><br/>This link expires in 5 minutes.`
                });
            }
        },
        deleteUser: {
            enabled: true,
            deleteTokenExpiresIn: 60 * 5,
            async sendDeleteAccountVerification({ user, url }) {
                void sendEmail({
                    to: user.email,
                    subject: "Confirm account deletion",
                    html: `Hi ${user.name},<br/><br/>You requested to delete your account.<br/><br/>Account email: ${user.email}<br/><br/>Click the link below to confirm your account deletion:<br/>${url}<br/><br/>This link expires in 5 minutes.<br/><br/>If you didn't request this, you can safely ignore this email.`
                });
            }
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
