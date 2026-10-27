"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";
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

type TwoFactorMethod = "totp" | "otp";

type EnableTwoFactorProps = {
    initiallyEnabled: boolean;
    initiallySelectedMethod: TwoFactorMethod;
};

export function EnableTwoFactor({
    initiallyEnabled,
    initiallySelectedMethod
}: EnableTwoFactorProps) {
    const [setup, setSetup] = useState<SetupData | null>(null);
    const [isEnabled, setIsEnabled] = useState(initiallyEnabled);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>(
        initiallySelectedMethod
    );

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
                method: selectedMethod
            });
            if (error) throw new Error(error.message);
            if (!data || data.method !== selectedMethod) {
                throw new Error("Unable to start authenticator setup.");
            }

            if (data.method === "otp") {
                setIsEnabled(true);
                setIsPasswordDialogOpen(false);
                passwordForm.reset();
                toast.success("Email OTP two-factor authentication enabled.");
                return;
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

    async function regenerateBackupCodes({ password }: { password: string }) {
        setIsLoading(true);
        try {
            const { data, error } =
                await authClient.twoFactor.generateBackupCodes({
                    password
                });
            if (error) throw new Error(error.message);
            if (!data?.backupCodes?.length) {
                throw new Error("Unable to generate backup codes.");
            }

            setIsRegenerateDialogOpen(false);
            passwordForm.reset();
            setSetup({ totpURI: "", backupCodes: data.backupCodes });
            toast.success("New backup codes generated.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to generate backup codes."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function copyBackupCodes(codes = setup?.backupCodes) {
        if (!codes) return;
        try {
            await navigator.clipboard.writeText(codes.join("\n"));
            toast.success("Backup codes copied.");
        } catch {
            toast.error("Unable to copy backup codes. Save them manually.");
        }
    }

    function downloadBackupCodes(codes = setup?.backupCodes) {
        if (!codes) return;

        const file = new Blob([codes.join("\n")], {
            type: "text/plain;charset=utf-8"
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.download = "recovery-codes.txt";
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Recovery codes downloaded.");
    }

    if (isEnabled) {
        return (
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Two-factor authentication is enabled</CardTitle>
                    <CardDescription>
                        Your account is protected by{" "}
                        {selectedMethod === "otp"
                            ? "email verification codes."
                            : "an authenticator app and backup codes."}
                    </CardDescription>
                </CardHeader>
                {selectedMethod === "totp" && (
                    <CardContent>
                        <AlertDialog
                            open={isRegenerateDialogOpen}
                            onOpenChange={(open) => {
                                setIsRegenerateDialogOpen(open);
                                if (!open) passwordForm.reset();
                            }}
                        >
                            <AlertDialogTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        <KeyRound className="size-4.5" />
                                        Regenerate backup codes
                                    </Button>
                                }
                            />
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Regenerate backup codes?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Your current backup codes will stop
                                        working immediately. Enter your password
                                        to generate a new set.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <form
                                    id="regenerate-backup-codes-form"
                                    onSubmit={passwordForm.handleSubmit(
                                        regenerateBackupCodes
                                    )}
                                >
                                    <FieldGroup>
                                        <Controller
                                            name="password"
                                            control={passwordForm.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="regenerate-backup-codes-password">
                                                        Current password
                                                    </FieldLabel>
                                                    <InputPassword
                                                        {...field}
                                                        id="regenerate-backup-codes-password"
                                                        autoComplete="current-password"
                                                        disabled={isLoading}
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </FieldGroup>
                                </form>
                                <AlertDialogFooter>
                                    <div className="w-full grid gap-y-3 md:grid-cols-2 gap-x-3">
                                        <AlertDialogCancel
                                            disabled={isLoading}
                                            className="order-2 md:order-1 py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                        >
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            type="submit"
                                            form="regenerate-backup-codes-form"
                                            disabled={isLoading}
                                            className="order-1 md:order-2 py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                        >
                                            {isLoading
                                                ? "Generating..."
                                                : "Regenerate codes"}
                                        </AlertDialogAction>
                                    </div>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        {setup && (
                            <div className="mt-4 rounded-lg border p-4">
                                <p className="font-medium">
                                    Your new backup codes
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your previous backup codes are no longer
                                    valid. Save these codes securely.
                                </p>
                                <code className="mt-3 block break-all text-sm">
                                    {setup.backupCodes.join(" ")}
                                </code>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            copyBackupCodes(setup.backupCodes)
                                        }
                                        className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        Copy backup codes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            downloadBackupCodes(
                                                setup.backupCodes
                                            )
                                        }
                                        className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                    >
                                        Download backup codes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
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
                    {setup.totpURI && (
                        <>
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
                        </>
                    )}
                    <div className="rounded-lg border p-4">
                        <p className="font-medium">
                            {setup.totpURI
                                ? "Save your backup codes"
                                : "Your new backup codes"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {setup.totpURI
                                ? "Each code can be used once if you lose access to your authenticator app."
                                : "Your previous backup codes are no longer valid. Save these codes securely."}
                        </p>
                        <code className="mt-3 block break-all text-sm">
                            {setup.backupCodes.join(" ")}
                        </code>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <Button
                                type="button"
                                onClick={() => copyBackupCodes()}
                                className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Copy backup codes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => downloadBackupCodes()}
                                className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                            >
                                Download recovery codes
                            </Button>
                        </div>
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
                    <div className="w-full grid gap-y-3 md:grid-cols-2 gap-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => setSetup(null)}
                            className="order-2 md:order-1 py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="verify-two-factor-form"
                            disabled={isLoading}
                            className="order-1 md:order-2 py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
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
                                <Field>
                                    <FieldLabel>Verification method</FieldLabel>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Button
                                            type="button"
                                            variant={
                                                selectedMethod === "totp"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                setSelectedMethod("totp")
                                            }
                                            disabled={isLoading}
                                            className="h-auto min-h-20 justify-start whitespace-normal text-left"
                                        >
                                            <span>
                                                <span className="block font-semibold">
                                                    Authenticator app
                                                </span>
                                                <span className="block text-xs font-normal opacity-80">
                                                    Use a TOTP code from an
                                                    authenticator app.
                                                </span>
                                            </span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={
                                                selectedMethod === "otp"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() =>
                                                setSelectedMethod("otp")
                                            }
                                            disabled={isLoading}
                                            className="h-auto min-h-20 justify-start whitespace-normal text-left"
                                        >
                                            <span>
                                                <span className="block font-semibold">
                                                    Email code
                                                </span>
                                                <span className="block text-xs font-normal opacity-80">
                                                    Receive a one-time code by
                                                    email.
                                                </span>
                                            </span>
                                        </Button>
                                    </div>
                                </Field>
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
                            <div className="w-full grid gap-y-3 md:grid-cols-2 gap-x-3">
                                <AlertDialogCancel
                                    disabled={isLoading}
                                    className="order-2 md:order-1 py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    type="submit"
                                    form="enable-two-factor-form"
                                    disabled={isLoading}
                                    className="order-1 md:order-2 py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
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
