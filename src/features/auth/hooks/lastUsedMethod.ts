"use client";

import { authClient } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

export function useLastUsedMethod() {
    return useSyncExternalStore(
        () => () => {},
        () => {
            const method = authClient.getLastUsedLoginMethod();
            return typeof method === "string" ? method : null;
        },
        () => null
    );
}
