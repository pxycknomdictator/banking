"use client";

import { useState } from "react";
import {
    Check,
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
            className={
                emailVerified
                    ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20"
            }
        >
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <div
                        className={`size-20 flex items-center justify-center rounded-full ${
                            emailVerified
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                        }`}
                    >
                        {emailVerified ? (
                            <ShieldCheck className="size-6" />
                        ) : (
                            <Mail className="size-6" />
                        )}
                    </div>
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold">
                                {emailVerified
                                    ? "Your email is verified"
                                    : "Verify your email address"}
                            </h2>
                            <Badge
                                variant={emailVerified ? "default" : "outline"}
                                className={`${
                                    emailVerified
                                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                                        : "border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-300"
                                }`}
                            >
                                {emailVerified ? (
                                    <CheckCircle2 />
                                ) : (
                                    <MailCheck />
                                )}
                                {emailVerified ? "Verified" : "Action needed"}
                            </Badge>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                            {email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {emailVerified
                                ? "Your account is protected with a confirmed email address."
                                : "Confirm your email to secure your account and receive important notifications."}
                        </p>
                    </div>
                </div>
                {!emailVerified && (
                    <Button
                        type="button"
                        onClick={sendVerificationEmail}
                        disabled={isSending}
                        className="py-6 px-5 gap-x-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {isSending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <MailCheck />
                        )}
                        {isSending ? "Sending..." : "Verify your email"}
                    </Button>
                )}
                {emailVerified && (
                    <div className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-emerald-700 sm:flex dark:text-emerald-300">
                        <Check className="size-4" />
                        All set
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
