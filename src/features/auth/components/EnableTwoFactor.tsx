"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
    passwordSchema,
    twoFactorTOTPSchema,
    type TwoFactorTOTPSchema
} from "@/features/auth/validators";
import { InputPassword } from "@/features/auth/components/InputPassword";

type SetupData = {
    totpURI: string;
    backupCodes: string[];
};

type EnableTwoFactorProps = {
    initiallyEnabled: boolean;
};

export function EnableTwoFactor({ initiallyEnabled }: EnableTwoFactorProps) {
    const [setup, setSetup] = useState<SetupData | null>(null);
    const [isEnabled, setIsEnabled] = useState(initiallyEnabled);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordForm = useForm<{ password: string }>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "" }
    });

    const totpForm = useForm<TwoFactorTOTPSchema>({
        resolver: zodResolver(twoFactorTOTPSchema),
        defaultValues: { code: "", trustDevice: false }
    });

    async function beginSetup({ password }: { password: string }) {
        setIsLoading(true);
        try {
            const { data, error } = await authClient.twoFactor.enable({
                password,
                method: "totp"
            });
            if (error) throw new Error(error.message);
            if (!data || data.method !== "totp") {
                throw new Error("Unable to start authenticator setup.");
            }
            setSetup({ totpURI: data.totpURI, backupCodes: data.backupCodes });
            setIsPasswordDialogOpen(false);
            passwordForm.reset();
            toast.success("Scan the QR code with your authenticator app.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to enable two-factor authentication."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function verifySetup({ code }: TwoFactorTOTPSchema) {
        setIsLoading(true);
        try {
            const { error } = await authClient.twoFactor.verifyTotp({ code });
            if (error) throw new Error(error.message);
            toast.success("Two-factor authentication enabled.");
            setIsEnabled(true);
            setSetup(null);
            totpForm.reset();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "The verification code is invalid."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function copyBackupCodes() {
        if (!setup) return;
        try {
            await navigator.clipboard.writeText(setup.backupCodes.join("\n"));
            toast.success("Backup codes copied.");
        } catch {
            toast.error("Unable to copy backup codes. Save them manually.");
        }
    }

    if (isEnabled) {
        return (
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Two-factor authentication is enabled</CardTitle>
                    <CardDescription>
                        Your account is protected by an authenticator app and
                        backup codes.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (setup) {
        return (
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Set up two-factor authentication</CardTitle>
                    <CardDescription>
                        Scan this QR code with an authenticator app, then enter
                        the 6-digit code it generates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="gap-5">
                    <div className="flex justify-center rounded-lg bg-white p-4">
                        <QRCodeSVG
                            value={setup.totpURI}
                            size={192}
                            aria-label="Two-factor authentication QR code"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="totp-uri">
                            Can&apos;t scan the code?
                        </Label>
                        <Input
                            id="totp-uri"
                            value={setup.totpURI}
                            readOnly
                            className="py-5.75 pl-3"
                        />
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="font-medium">Save your backup codes</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Each code can be used once if you lose access to
                            your authenticator app.
                        </p>
                        <code className="mt-3 block break-all text-sm">
                            {setup.backupCodes.join(" ")}
                        </code>
                        <Button
                            type="button"
                            onClick={copyBackupCodes}
                            className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 mt-4"
                        >
                            Copy backup codes
                        </Button>
                    </div>
                    <form
                        id="verify-two-factor-form"
                        onSubmit={totpForm.handleSubmit(verifySetup)}
                    >
                        <FieldGroup>
                            <Controller
                                name="code"
                                control={totpForm.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="totp-code">
                                            Authenticator code
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="totp-code"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            disabled={isLoading}
                                            className="py-5.75 pl-3"
                                            onChange={(event) =>
                                                field.onChange(
                                                    event.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="w-full grid grid-cols-2 gap-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => setSetup(null)}
                            className="py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="verify-two-factor-form"
                            disabled={isLoading}
                            className="py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {isLoading ? "Verifying..." : "Verify and enable"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Enable two-factor authentication</CardTitle>
                <CardDescription>
                    Protect your account with a code from an authenticator app.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog
                    open={isPasswordDialogOpen}
                    onOpenChange={setIsPasswordDialogOpen}
                >
                    <AlertDialogTrigger
                        render={
                            <Button className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45">
                                Enable two-factor authentication
                            </Button>
                        }
                    />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Confirm your password
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Enter your current password to begin setting up
                                two-factor authentication.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form
                            id="enable-two-factor-form"
                            onSubmit={passwordForm.handleSubmit(beginSetup)}
                        >
                            <FieldGroup>
                                <Controller
                                    name="password"
                                    control={passwordForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="two-factor-password">
                                                Current password
                                            </FieldLabel>
                                            <InputPassword
                                                {...field}
                                                id="two-factor-password"
                                                autoComplete="current-password"
                                                disabled={isLoading}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                        <AlertDialogFooter>
                            <div className="w-full grid grid-cols-2 gap-x-3">
                                <AlertDialogCancel
                                    disabled={isLoading}
                                    className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    type="submit"
                                    form="enable-two-factor-form"
                                    disabled={isLoading}
                                    className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                    {isLoading
                                        ? "Starting setup..."
                                        : "Continue"}
                                </AlertDialogAction>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
