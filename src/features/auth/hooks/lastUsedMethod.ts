"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function useLastUsedMethod() {
    const [lastMethod, setLastMethod] = useState<string | null>(null);

    useEffect(() => {
        const method = authClient.getLastUsedLoginMethod();
        if (method && typeof method === "string") setLastMethod(method);
    }, []);

    return lastMethod;
}
