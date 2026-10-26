"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader, Shield, Smartphone } from "lucide-react";
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
    twoFactorTOTPSchema,
    type TwoFactorTOTPSchema
} from "@/features/auth/validators";

export function TwoFactorTOTPForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<TwoFactorTOTPSchema>({
        resolver: zodResolver(twoFactorTOTPSchema),
        defaultValues: { code: "", trustDevice: false }
    });

    async function onSubmit({ code, trustDevice }: TwoFactorTOTPSchema) {
        setIsLoading(true);
        try {
            const { data, error } = await authClient.twoFactor.verifyTotp({
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

    return (
        <FormWrapper>
            <CardHeader>
                <TopRoundIcon LucideIcon={Smartphone} />
                <h1 className="font-medium text-2xl">Verify your identity</h1>
            </CardHeader>
            <CardContent>
                <form
                    id="two-factor-totp-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup className="-space-y-2">
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="two-factor-code">
                                        Authenticator code
                                    </FieldLabel>
                                    <InputOTP
                                        {...field}
                                        id="two-factor-code"
                                        maxLength={6}
                                        containerClassName="w-full"
                                        className="w-full"
                                        inputMode="numeric"
                                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                        disabled={isLoading}
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
                                        Enter the 6-digit code from your
                                        authenticator app.
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
                                        id="totp-trust-device"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                    />
                                    <FieldLabel
                                        htmlFor="totp-trust-device"
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
                        form="two-factor-totp-form"
                        disabled={isLoading}
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
                            Don&apos;t have access to authentication?
                        </span>{" "}
                        <Link
                            href="/two-factor/recovery-code"
                            className="font-medium hover:underline"
                        >
                            Recovery code
                        </Link>
                    </div>
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
