import { passkeyClient } from "@better-auth/passkey/client";
import {
    adminClient,
    lastLoginMethodClient,
    twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        adminClient(),
        lastLoginMethodClient({ cookieName: "banking.last_used_login_method" }),
        twoFactorClient(),
        passkeyClient(),
    ],
});
