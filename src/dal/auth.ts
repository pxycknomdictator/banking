import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type BetterAuthSession, type BetterAuthUser } from "@/lib/auth";

type GetSessionResponse = {
    user: BetterAuthUser;
    session: BetterAuthSession;
};

export function redirectToDashboard(user: BetterAuthUser): void {
    if (user.role === "admin") redirect("/admin/dashboard");
    else redirect("/dashboard");
}

export async function getSession(): Promise<GetSessionResponse | null> {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
}

export async function userSession(): Promise<GetSessionResponse> {
    const session = await getSession();
    if (!session) redirect("/sign-in");
    return session;
}

export async function authSession(): Promise<GetSessionResponse | null> {
    const session = await getSession();
    if (session) {
        if (!session.user.emailVerified) redirect("/verify-email");
        redirectToDashboard(session.user);
    }
    return null;
}

export async function unverifiedSession(): Promise<GetSessionResponse> {
    const session = await userSession();
    if (session.user.emailVerified) redirectToDashboard(session.user);
    return session;
}

export async function verifiedSession(): Promise<GetSessionResponse> {
    const session = await userSession();
    if (!session.user.emailVerified) redirect("/verify-email");
    return session;
}

export async function twoFactorSession(): Promise<GetSessionResponse> {
    const session = await verifiedSession();
    const cookieStore = await cookies();
    const token = cookieStore.get("__Secure-better-auth.two_factor");
    if (!token) redirectToDashboard(session.user);
    return session;
}

export async function adminSession(): Promise<GetSessionResponse> {
    const session = await verifiedSession();
    if (session.user.role !== "admin") redirect("/unauthorized");
    return session;
}
