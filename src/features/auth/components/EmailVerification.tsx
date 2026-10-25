"use client";

import { useState } from "react";
import {
    CheckCircle2,
    Loader2,
    Mail,
    MailCheck,
    ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

type EmailVerificationProps = {
    email: string;
    emailVerified: boolean;
};

export function EmailVerification({
    email,
    emailVerified
}: EmailVerificationProps) {
    const [isSending, setIsSending] = useState(false);

    async function sendVerificationEmail() {
        setIsSending(true);
        try {
            const { error } = await authClient.sendVerificationEmail({
                email,
                callbackURL: "/dashboard"
            });
            if (error) {
                toast.error(
                    error.message || "Could not send the verification email."
                );
                return;
            }

            toast.success("Verification email sent.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not send the verification email."
            );
        } finally {
            setIsSending(false);
        }
    }

    return (
        <Card
            className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
                emailVerified
                    ? "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/70 dark:bg-emerald-950/20"
                    : "border-amber-200/80 bg-amber-50/50 dark:border-amber-900/70 dark:bg-amber-950/20"
            }`}
        >
            <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div className="flex min-w-0 flex-col items-stretch gap-5 sm:flex-row sm:items-start sm:gap-6">
                        <div
                            className={`mx-auto flex size-16 shrink-0 items-center justify-center rounded-2xl sm:mx-0 sm:size-14 ${
                                emailVerified
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            }`}
                        >
                            {emailVerified ? (
                                <ShieldCheck className="size-8 sm:size-7" />
                            ) : (
                                <Mail className="size-8 sm:size-7" />
                            )}
                        </div>
                        <div className="min-w-0 w-full flex-1 space-y-2 text-left">
                            <div className="flex flex-wrap items-center justify-between md:justify-start gap-2">
                                <h2 className="font-semibold tracking-tight text-[13px]">
                                    {emailVerified
                                        ? "Your email is verified"
                                        : "Verify your email address"}
                                </h2>
                                <Badge
                                    variant="outline"
                                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wide sm:text-[11px] ${
                                        emailVerified
                                            ? "border-emerald-200 bg-emerald-100/70 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                            : "border-amber-200 bg-amber-100/70 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                                    }`}
                                >
                                    {emailVerified ? (
                                        <CheckCircle2 className="size-3.5" />
                                    ) : (
                                        <MailCheck className="size-3.5" />
                                    )}
                                    {emailVerified
                                        ? "VERIFIED"
                                        : "ACTION NEEDED"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p
                                    className="break-all text-[13px] font-medium text-foreground"
                                    title={email}
                                >
                                    {email}
                                </p>
                                <p className="max-w-xl leading-relaxed text-muted-foreground text-[13px]">
                                    {emailVerified
                                        ? "Your email is confirmed and ready to receive important account notifications."
                                        : "Confirm your email address to help secure your account and receive important notifications."}
                                </p>
                            </div>
                        </div>
                    </div>
                    {!emailVerified && (
                        <Button
                            type="button"
                            onClick={sendVerificationEmail}
                            disabled={isSending}
                            className="py-6 px-5 gap-x-2 font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {isSending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <MailCheck className="size-4" />
                            )}
                            {isSending ? "Sending email..." : "Verify email"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
