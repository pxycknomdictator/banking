import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import {
    adminClient,
    lastLoginMethodClient,
    twoFactorClient
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        adminClient(),
        lastLoginMethodClient(),
        twoFactorClient({
            onTwoFactorRedirect: async ({ twoFactorMethods }) => {
                if (twoFactorMethods?.includes("otp")) {
                    await authClient.twoFactor.sendOtp();
                    window.location.pathname = "/two-factor/verify-otp";
                    return;
                }
                window.location.pathname = "/two-factor/verify-totp";
            }
        }),
        passkeyClient()
    ]
});
