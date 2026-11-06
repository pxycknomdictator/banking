"use client";

import { useState } from "react";
import {
    Laptop,
    Loader2,
    LogOut,
    Monitor,
    Smartphone,
    Tablet
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

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

function getSessionDetails(userAgent: string | null | undefined) {
    const parsed = new UAParser(userAgent ?? "").getResult();
    const isTablet = parsed.device.type === "tablet";
    const isMobile = parsed.device.type === "mobile";

    return {
        device: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
        os: parsed.os.name ?? "Unknown OS",
        browser: parsed.browser.name ?? "Unknown browser",
        Icon: isTablet ? Tablet : isMobile ? Smartphone : Laptop
    };
}

export function ActiveSessions({
    sessions: initialSessions,
    currentToken
}: ActiveSessionsProps) {
    const router = useRouter();
    const [sessions, setSessions] = useState(initialSessions);
    const [loading, setLoading] = useState<string | null>(null);
    const [sessionToRevoke, setSessionToRevoke] =
        useState<ActiveSession | null>(null);

    async function revokeSession(token: string) {
        setLoading(token);
        try {
            const { error } = await authClient.revokeSession({ token });
            if (error) throw new Error(error.message);
            setSessions((current) =>
                current.filter((session) => session.token !== token)
            );
            setSessionToRevoke(null);
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
            </CardHeader>
            <CardContent className="gap-5 pt-6">
                <div className="grid gap-3">
                    {sessions.map((session) => {
                        const isCurrent = session.token === currentToken;
                        const details = getSessionDetails(session.userAgent);
                        const DeviceIcon = details.Icon;
                        return (
                            <div
                                key={session.token}
                                className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <DeviceIcon className="size-5 shrink-0 text-muted-foreground" />
                                    <div className="min-w-0">
                                        <p className="font-medium">
                                            {`${details.browser} on ${details.os}`}
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
                                            setSessionToRevoke(session)
                                        }
                                        disabled={loading !== null}
                                        className="py-6 px-5 gap-x-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
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
                <Button
                    variant="destructive"
                    onClick={revokeAllSessions}
                    disabled={loading !== null}
                    className="py-7 px-5 gap-x-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:self-end"
                >
                    {loading === "all" ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <LogOut />
                    )}
                    Sign out all devices
                </Button>
            </CardContent>
            <AlertDialog
                open={sessionToRevoke !== null}
                onOpenChange={(open) => {
                    if (!open && loading === null) setSessionToRevoke(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader className="w-full place-items-start text-left">
                        <AlertDialogTitle>
                            Log out this session?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="w-full max-w-none text-left text-wrap">
                            This device will be signed out of your banking
                            account. You can sign in again later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="grid grid-cols-1 gap-2 sm:flex sm:justify-end">
                        <AlertDialogAction
                            variant="destructive"
                            className="order-1 w-full py-7 px-6 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sm:order-2 sm:w-auto"
                            onClick={() => {
                                if (sessionToRevoke) {
                                    void revokeSession(sessionToRevoke.token);
                                }
                            }}
                            disabled={loading !== null}
                        >
                            {loading === sessionToRevoke?.token ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Log out session"
                            )}
                        </AlertDialogAction>
                        <AlertDialogCancel
                            disabled={loading !== null}
                            className="order-2 w-full py-7 px-6 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sm:order-1 sm:w-auto"
                        >
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
