"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, Loader, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { TopRoundIcon } from "@/features/auth/components/TopRoundIcon";
import {
    twoFactorRecoveryCodeSchema,
    type TwoFactorRecoveryCodeSchema
} from "@/features/auth/validators";

export function RecoveryCodeForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<TwoFactorRecoveryCodeSchema>({
        resolver: zodResolver(twoFactorRecoveryCodeSchema),
        defaultValues: { code: "", trustDevice: false }
    });

    async function onSubmit({
        code,
        trustDevice
    }: TwoFactorRecoveryCodeSchema) {
        setIsLoading(true);
        try {
            const { data, error } = await authClient.twoFactor.verifyBackupCode(
                { code, trustDevice }
            );
            if (error) throw new Error(error.message);
            if (!data?.user) throw new Error("Unable to verify your code.");

            toast.success("Two-factor authentication verified.");
            router.push(getDashboardPath(data.user.role));
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to verify your code."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <FormWrapper>
            <CardHeader>
                <TopRoundIcon LucideIcon={KeyRound} />
                <h1 className="font-medium text-2xl">Verify your identity</h1>
            </CardHeader>
            <CardContent>
                <form
                    id="two-factor-recovery-code-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup className="-space-y-2">
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="two-factor-recovery-code">
                                        Recovery code
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="two-factor-recovery-code"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={10}
                                        autoComplete="one-time-code"
                                        disabled={isLoading}
                                        className="py-5.75 pl-3"
                                        onChange={(event) =>
                                            field.onChange(
                                                event.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 10)
                                            )
                                        }
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldDescription>
                                        Enter the 10-digit recovery code you
                                        saved when setting up two-factor
                                        authentication.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="trustDevice"
                            control={form.control}
                            render={({ field }) => (
                                <Field
                                    orientation="horizontal"
                                    className="w-fit hover:cursor-pointer"
                                >
                                    <Checkbox
                                        id="recovery-code-trust-device"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                    <FieldLabel
                                        htmlFor="recovery-code-trust-device"
                                        className="hover:cursor-pointer"
                                    >
                                        Trust this device
                                    </FieldLabel>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <section className="w-full">
                    <Button
                        type="submit"
                        form="two-factor-recovery-code-form"
                        disabled={isLoading}
                        className="w-full py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 relative"
                    >
                        {isLoading ? (
                            <Loader className="size-4.5 animate-[spin_2s_linear_infinite]" />
                        ) : (
                            <Shield className="size-4.5" />
                        )}
                        Verify code
                    </Button>
                    <div className="my-4 text-center">
                        <span className="font-normal">
                            Have access to an authenticator?
                        </span>{" "}
                        <Link
                            href="/two-factor/verify-totp"
                            className="font-medium hover:underline"
                        >
                            Authenticator
                        </Link>
                    </div>
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
