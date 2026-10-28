"use client";

import { useState } from "react";
import { Fingerprint, KeyRound, Loader, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PasskeyManager() {
    const passkeys = authClient.useListPasskeys();
    const [name, setName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    async function addPasskey() {
        setIsAdding(true);
        try {
            const result = await authClient.passkey.addPasskey({
                name: name.trim() || undefined
            });
            if (result.error) throw new Error(result.error.message);
            setName("");
            await passkeys.refetch();
            toast.success("Passkey added successfully.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to add this passkey."
            );
        } finally {
            setIsAdding(false);
        }
    }

    return (
        <Card className="max-w-2xl border-0 shadow-lg shadow-black/5 ring-1 ring-black/5 dark:shadow-black/20 dark:ring-white/10">
            <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Fingerprint className="size-5" />
                    </div>
                    <div>
                        <CardTitle>Passkeys</CardTitle>
                        <CardDescription className="mt-1">
                            Sign in securely with Face ID, Touch ID, or your
                            device PIN.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="gap-5 pt-6">
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Name this passkey (optional)"
                        disabled={isAdding}
                        aria-label="Passkey name"
                        className="py-7 pl-3"
                    />
                    <Button
                        type="button"
                        onClick={addPasskey}
                        disabled={isAdding}
                        className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 relative"
                    >
                        {isAdding ? (
                            <Loader className="size-4 animate-spin" />
                        ) : (
                            <Plus className="size-4" />
                        )}
                        Add passkey
                    </Button>
                </div>
                {passkeys.isPending ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader className="size-4 animate-spin" />
                        Loading your passkeys...
                    </div>
                ) : passkeys.error ? (
                    <p className="text-sm text-destructive">
                        Unable to load your passkeys. Please refresh and try
                        again.
                    </p>
                ) : passkeys.data?.length ? (
                    <div className="grid gap-3">
                        {passkeys.data.map((passkey) => (
                            <div
                                key={passkey.id}
                                className="flex items-center justify-between rounded-xl border bg-muted/30 p-4"
                            >
                                <div className="flex min-w-0 items-center gap-3.5">
                                    <KeyRound className="size-5 shrink-0 text-muted-foreground" />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {passkey.name || "Unnamed passkey"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {passkey.deviceType ===
                                            "singleDevice"
                                                ? "This device"
                                                : "Synced passkey"}
                                        </p>
                                    </div>
                                </div>
                                <ShieldCheck className="size-5 shrink-0 text-emerald-500" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed p-5 text-center">
                        <KeyRound className="mx-auto size-5 text-muted-foreground" />
                        <p className="mt-2 text-sm font-medium">
                            No passkeys yet
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add one above for faster, phishing-resistant
                            sign-ins.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
