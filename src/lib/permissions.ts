import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
    user: [
        "create",
        "read",
        "update",
        "delete",
        "list",
        "ban",
        "unban",
        "set-role",
        "set-password",
        "set-email",
        "impersonate",
    ],
    session: ["list", "revoke", "delete"],
    account: ["create", "read", "update", "delete", "list"],
    twoFactor: ["create", "read", "update", "delete", "verify"],
    passkey: ["create", "read", "update", "delete", "list"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
    user: [
        "create",
        "read",
        "update",
        "delete",
        "list",
        "ban",
        "unban",
        "set-role",
        "set-password",
        "set-email",
        "impersonate",
    ],
    session: ["list", "revoke", "delete"],
    account: ["create", "read", "update", "delete", "list"],
    twoFactor: ["create", "read", "update", "delete", "verify"],
    passkey: ["create", "read", "update", "delete", "list"],
});

export const user = ac.newRole({
    user: ["read", "update"],
    session: ["list"],
    account: ["list"],
    twoFactor: ["read", "create", "update", "verify"],
    passkey: ["list", "create", "delete"],
});
