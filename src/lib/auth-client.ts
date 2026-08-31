import { passkeyClient } from "@better-auth/passkey/client";
import {
    adminClient,
    lastLoginMethodClient,
    twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, user } from "@/lib/permissions";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        adminClient({ ac, roles: { admin, user } }),
        lastLoginMethodClient({ cookieName: "banking.last_used_login_method" }),
        twoFactorClient(),
        passkeyClient(),
    ],
});
