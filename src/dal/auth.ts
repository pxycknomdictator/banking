import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type BetterAuthSession, type BetterAuthUser } from "@/lib/auth";

type GetSessionResponse = {
    user: BetterAuthUser;
    session: BetterAuthSession;
};

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
        if (session.user.role === "admin") redirect("/admin/dashboard");
        redirect("/dashboard");
    }
    return null;
}

export async function unverifiedSession(): Promise<GetSessionResponse> {
    const session = await userSession();
    if (session.user.emailVerified) {
        if (session.user.role === "admin") redirect("/admin/dashboard");
        else redirect("/dashboard");
    }
    return session;
}

export async function verifiedSession(): Promise<GetSessionResponse> {
    const session = await userSession();
    if (!session.user.emailVerified) redirect("/verify-email");
    return session;
}

export async function twoFactorSession(): Promise<GetSessionResponse> {
    const session = await verifiedSession();
    const cookie = await cookies();
    const token = cookie.get("better-auth.two_factor");

    if (!token) {
        if (session.user.role === "admin") redirect("/admin/dashboard");
        else redirect("/dashboard");
    }

    return session;
}

export async function adminSession(): Promise<GetSessionResponse> {
    const session = await verifiedSession();
    if (session.user.role !== "admin") redirect("/unauthorized");
    return session;
}
