"use client";

import { useState } from "react";
import { Loader2, LogOut, Monitor } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

type ActiveSession = {
    token: string;
    createdAt: Date | string;
    expiresAt: Date | string;
    ipAddress?: string | null;
    userAgent?: string | null;
};

type ActiveSessionsProps = {
    sessions: ActiveSession[];
    currentToken: string;
};

function sessionLabel(userAgent: string | null | undefined) {
    if (!userAgent) return "Unknown device";
    if (/mobile|android|iphone|ipad/i.test(userAgent)) return "Mobile device";
    return "Desktop browser";
}

export function ActiveSessions({
    sessions: initialSessions,
    currentToken
}: ActiveSessionsProps) {
    const router = useRouter();
    const [sessions, setSessions] = useState(initialSessions);
    const [loading, setLoading] = useState<string | null>(null);

    async function revokeSession(token: string) {
        setLoading(token);
        try {
            const { error } = await authClient.revokeSession({ token });
            if (error) throw new Error(error.message);
            setSessions((current) =>
                current.filter((session) => session.token !== token)
            );
            toast.success("Session signed out.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not sign out session."
            );
        } finally {
            setLoading(null);
        }
    }

    async function revokeAllSessions() {
        setLoading("all");
        try {
            const { error } = await authClient.revokeSessions();
            if (error) throw new Error(error.message);
            router.push("/sign-in");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not sign out all devices."
            );
            setLoading(null);
        }
    }

    return (
        <Card className="max-w-2xl border-0 shadow-lg shadow-black/5 ring-1 ring-black/5 dark:shadow-black/20 dark:ring-white/10">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Monitor className="size-5" />
                        </div>
                        <div>
                            <CardTitle>Active sessions</CardTitle>
                            <CardDescription className="mt-1">
                                Review devices signed in to your account.
                            </CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={revokeAllSessions}
                        disabled={loading !== null}
                        className="py-7 px-4 font-semibold gap-x-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {loading === "all" ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <LogOut />
                        )}
                        Sign out all devices
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="gap-5 pt-6">
                <div className="grid gap-3">
                    {sessions.map((session) => {
                        const isCurrent = session.token === currentToken;
                        return (
                            <div
                                key={session.token}
                                className="flex items-center justify-between gap-4 rounded-xl border bg-muted/30 p-4"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <Monitor className="size-5 shrink-0 text-muted-foreground" />
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {sessionLabel(session.userAgent)}
                                            {isCurrent ? " (This device)" : ""}
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {session.ipAddress ??
                                                "IP unavailable"}{" "}
                                            ·{" "}
                                            {new Date(
                                                session.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {!isCurrent && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            revokeSession(session.token)
                                        }
                                        disabled={loading !== null}
                                        className="py-5 px-4 gap-x-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        {loading === session.token ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            "Sign out"
                                        )}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
