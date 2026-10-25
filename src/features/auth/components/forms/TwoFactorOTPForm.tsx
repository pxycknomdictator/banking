"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader, Mail, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";
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
    twoFactorOTPSchema,
    type TwoFactorOTPSchema
} from "@/features/auth/validators";

export function TwoFactorOTPForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const form = useForm<TwoFactorOTPSchema>({
        resolver: zodResolver(twoFactorOTPSchema),
        defaultValues: { code: "", trustDevice: false }
    });

    async function onSubmit({ code, trustDevice }: TwoFactorOTPSchema) {
        setIsLoading(true);
        try {
            const { data, error } = await authClient.twoFactor.verifyOtp({
                code,
                trustDevice
            });
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

    async function resendCode() {
        setIsResending(true);
        try {
            const { error } = await authClient.twoFactor.sendOtp();
            if (error) throw new Error(error.message);
            form.resetField("code");
            toast.success("A new verification code was sent.");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to send a new verification code."
            );
        } finally {
            setIsResending(false);
        }
    }

    return (
        <FormWrapper>
            <CardHeader>
                <TopRoundIcon LucideIcon={Mail} />
                <h1 className="font-medium text-2xl">Verify your identity</h1>
            </CardHeader>
            <CardContent>
                <form
                    id="two-factor-otp-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="two-factor-otp-code">
                                        Email verification code
                                    </FieldLabel>
                                    <InputOTP
                                        {...field}
                                        id="two-factor-otp-code"
                                        maxLength={6}
                                        containerClassName="w-full"
                                        className="w-full"
                                        inputMode="numeric"
                                        pattern={REGEXP_ONLY_DIGITS}
                                        disabled={isLoading || isResending}
                                        onChange={(value) =>
                                            field.onChange(
                                                value.replace(/\D/g, "")
                                            )
                                        }
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <InputOTPGroup className="grid grid-cols-6 gap-x-3">
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <InputOTPSlot
                                                    className="border rounded-sm h-14"
                                                    key={index}
                                                    index={index}
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <FieldDescription>
                                        Enter the 6-digit code sent to your
                                        email.
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
                                <Field orientation="horizontal">
                                    <Checkbox
                                        id="otp-trust-device"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading || isResending}
                                    />
                                    <FieldLabel htmlFor="otp-trust-device">
                                        Trust this device
                                    </FieldLabel>
                                </Field>
                            )}
                        />
                        <Button
                            type="button"
                            variant="link"
                            onClick={resendCode}
                            disabled={isLoading || isResending}
                            className="w-fit self-center cursor-pointer"
                        >
                            {isResending ? "Sending..." : "Resend code"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <section className="w-full">
                    <Button
                        type="submit"
                        form="two-factor-otp-form"
                        disabled={isLoading || isResending}
                        className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
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
                            Didn't receive the code?
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
