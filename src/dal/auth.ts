import { auth, type BetterAuthSession, type BetterAuthUser } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SessionResponse = {
    user: BetterAuthUser;
    session: BetterAuthSession;
};

export async function getSession(): Promise<SessionResponse> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/sign-in");
    return session;
}

export async function verifiedSession(): Promise<SessionResponse> {
    const session = await getSession();
    if (!session.user.emailVerified) redirect("/verify-email");
    return session;
}

export async function adminSession(): Promise<SessionResponse> {
    const session = await verifiedSession();
    if (session.user.role !== "admin") redirect("/dashboard");
    return session;
}

export async function unverifiedSession(): Promise<SessionResponse> {
    const session = await getSession();
    if (session.user.emailVerified) {
        if (session.user.role !== "admin") redirect("/dashboard");
        else redirect("/admin/dashboard");
    }
    return session;
}

export async function checkTwoFactorAuth(): Promise<SessionResponse> {
    const session = await verifiedSession();
    if (!session.user.twoFactorEnabled) {
        if (session.user.role !== "admin") redirect("/dashboard");
        else redirect("/admin/dashboard");
    }
    return session;
}
