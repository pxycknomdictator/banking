import "server-only";

import { auth, type BetterAuthSession, type BetterAuthUser } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkRoleAndRedirect } from "@/lib/utils";

export type BETTER_AUTH_DAL = {
    user: BetterAuthUser;
    session: BetterAuthSession;
};

export async function getSession(): Promise<BETTER_AUTH_DAL | null> {
    const webAppSession = await auth.api.getSession({
        headers: await headers()
    });

    return webAppSession;
}

export async function getAuthenticatedSession(): Promise<BETTER_AUTH_DAL> {
    const webAppSession = await getSession();
    if (!webAppSession) redirect("/sign-in");
    return webAppSession;
}

export async function userSession(): Promise<BETTER_AUTH_DAL> {
    const webAppSession = await getAuthenticatedSession();

    if (webAppSession.user.role !== "user") {
        checkRoleAndRedirect(webAppSession);
    }

    return webAppSession;
}

export async function managerSession(): Promise<BETTER_AUTH_DAL> {
    const webAppSession = await getAuthenticatedSession();

    if (webAppSession.user.role !== "manager") {
        checkRoleAndRedirect(webAppSession);
    }

    return webAppSession;
}

export async function adminSession(): Promise<BETTER_AUTH_DAL> {
    const webAppSession = await getAuthenticatedSession();

    if (webAppSession.user.role !== "admin") {
        checkRoleAndRedirect(webAppSession);
    }

    return webAppSession;
}
