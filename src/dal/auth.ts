import { headers } from "next/headers";
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

export async function verifiedSession(): Promise<GetSessionResponse> {
    const session = await userSession();
    if (!session.user.emailVerified) redirect("/verify-email");
    return session;
}
