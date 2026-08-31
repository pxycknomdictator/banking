import { passkey } from "@better-auth/passkey";
import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
    admin as adminPlugin,
    lastLoginMethod,
    twoFactor,
} from "better-auth/plugins";
import { db } from "@/db";
import { sendEmail } from "@/lib/email";
import { passwords } from "@/lib/password";
import { ac, admin, user } from "@/lib/permissions";
import { redis } from "@/lib/redis";

export const auth = betterAuth({
    appName: "banking",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
        resetPasswordTokenExpiresIn: 60 * 5,
        revokeSessionsOnPasswordReset: true,
        async sendResetPassword({ user, url }) {
            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                html: `Click the link to reset your password: ${url}`,
            });
        },
        password: {
            async hash(password) {
                return await passwords.hash(password);
            },
            async verify({ hash, password }) {
                return await passwords.verify(hash, password);
            },
        },
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: false,
        transaction: true,
    }),
    emailVerification: {
        expiresIn: 60 * 5,
        sendOnSignUp: true,
        async sendVerificationEmail({ user, url }) {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                html: `Click the link to verify your email: ${url}`,
            });
        },
    },
    account: {
        storeStateStrategy: "database",
        accountLinking: {
            enabled: true,
            allowDifferentEmails: false,
            trustedProviders: ["google", "github", "discord", "email-password"],
        },
    },
    verification: { storeIdentifier: "hashed", storeInDatabase: false },
    secondaryStorage: redisStorage({
        client: redis,
        keyPrefix: "banking:",
    }),
    advanced: {
        cookiePrefix: "banking",
        disableCSRFCheck: false,
        useSecureCookies: true,
    },
    session: {
        expiresIn: 60 * 60 * 24,
        updateAge: 60 * 60,
        preserveSessionInDatabase: false,
        storeSessionInDatabase: true,
    },
    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: false,
            async sendChangeEmailConfirmation({ user, newEmail, url }) {
                void sendEmail({
                    to: user.email,
                    subject: "Confirm your email change",
                    html: `Hi ${user.name}, you requested to change your email to ${newEmail}. Confirm it here: ${url}. If you didn't request this, you can ignore this email.`,
                });
            },
        },
        deleteUser: {
            enabled: true,
            deleteTokenExpiresIn: 60 * 15,
            async sendDeleteAccountVerification({ user, url }) {
                void sendEmail({
                    to: user.email,
                    subject: "Confirm account deletion",
                    html: `Hi ${user.name}, you requested to delete your account. Confirm it here: ${url}. If you didn't request this, you can ignore this email.`,
                });
            },
        },
    },
    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        storage: "secondary-storage",
        customRules: {
            "/sign-in/email": { window: 60, max: 10 },
            "/sign-up/email": { window: 60, max: 5 },
            "/sign-in/social": { window: 60, max: 10 },
            "/callback/:id": { window: 60, max: 20 },
            "/get-session": { window: 60, max: 60 },
            "/sign-out": { window: 60, max: 20 },
            "/reset-password": { window: 60, max: 5 },
            "/reset-password/:token": { window: 60, max: 10 },
            "/verify-password": { window: 60, max: 10 },
            "/request-password-reset": { window: 60, max: 5 },
            "/send-verification-email": { window: 60, max: 5 },
            "/change-password": { window: 60, max: 10 },
            "/verify-email": { window: 60, max: 10 },
            "/change-email": { window: 60, max: 5 },
            "/update-session": { window: 60, max: 20 },
            "/update-user": { window: 60, max: 20 },
            "/delete-user": { window: 60, max: 3 },
            "/list-sessions": { window: 60, max: 30 },
            "/revoke-session": { window: 60, max: 20 },
            "/revoke-sessions": { window: 60, max: 10 },
            "/revoke-other-sessions": { window: 60, max: 10 },
            "/link-social": { window: 60, max: 5 },
            "/list-accounts": { window: 60, max: 30 },
            "/unlink-account": { window: 60, max: 5 },
            "/refresh-token": { window: 60, max: 30 },
            "/get-access-token": { window: 60, max: 30 },
            "/account-info": { window: 60, max: 30 },
            "/two-factor/get-totp-uri": { window: 60, max: 10 },
            "/two-factor/verify-totp": { window: 60, max: 5 },
            "/two-factor/send-otp": { window: 60, max: 3 },
            "/two-factor/verify-otp": { window: 60, max: 5 },
            "/two-factor/verify-backup-code": { window: 60, max: 5 },
            "/two-factor/generate-backup-codes": { window: 60, max: 3 },
            "/two-factor/enable": { window: 60, max: 5 },
            "/two-factor/disable": { window: 60, max: 5 },
            "/passkey/generate-register-options": { window: 60, max: 10 },
            "/passkey/generate-authenticate-options": { window: 60, max: 10 },
            "/passkey/verify-registration": { window: 60, max: 5 },
            "/passkey/verify-authentication": { window: 60, max: 10 },
            "/passkey/list-user-passkeys": { window: 60, max: 30 },
            "/passkey/delete-passkey": { window: 60, max: 5 },
            "/passkey/update-passkey": { window: 60, max: 10 },
            "/admin/set-role": { window: 60, max: 10 },
            "/admin/get-user": { window: 60, max: 30 },
            "/admin/create-user": { window: 60, max: 5 },
            "/admin/update-user": { window: 60, max: 10 },
            "/admin/list-users": { window: 60, max: 20 },
            "/admin/list-user-sessions": { window: 60, max: 20 },
            "/admin/unban-user": { window: 60, max: 5 },
            "/admin/ban-user": { window: 60, max: 5 },
            "/admin/impersonate-user": { window: 60, max: 3 },
            "/admin/stop-impersonating": { window: 60, max: 5 },
            "/admin/revoke-user-session": { window: 60, max: 10 },
            "/admin/revoke-user-sessions": { window: 60, max: 5 },
            "/admin/remove-user": { window: 60, max: 3 },
            "/admin/set-user-password": { window: 60, max: 5 },
            "/admin/has-permission": { window: 60, max: 30 },
        },
    },
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
    plugins: [
        adminPlugin({
            ac,
            roles: { admin, user },
            defaultRole: "user",
            adminRoles: ["admin"],
        }),
        lastLoginMethod({
            storeInDatabase: false,
            cookieName: "banking.last_used_login_method",
        }),
        twoFactor({
            issuer: "Banking",
            trustDeviceMaxAge: 60 * 60 * 24 * 30,
            otpOptions: {
                digits: 6,
                period: 3,
                storeOTP: "encrypted",
                async sendOTP({ user, otp }) {
                    void sendEmail({
                        to: user.email,
                        subject: "Two Factor verification",
                        html: `Your two-factor authentication code is: ${otp}`,
                    });
                },
            },
            totpOptions: { digits: 6, period: 30 },
            backupCodeOptions: {
                amount: 10,
                length: 10,
                storeBackupCodes: "encrypted",
            },
        }),
        passkey({
            rpID: "localhost",
            rpName: "Banking",
            origin: process.env.APPLICATION_URL,
            registration: { requireSession: true },
        }),
        nextCookies(),
    ],
});

export type BetterAuthUser = typeof auth.$Infer.Session.user;
export type BetterAuthSession = typeof auth.$Infer.Session.session;
