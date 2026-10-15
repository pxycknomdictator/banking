"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, KeyRound, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { InputPassword } from "@/features/auth/components/InputPassword";
import { TopRoundIcon } from "@/features/auth/components/TopRoundIcon";
import {
    resetPasswordSchema,
    type ResetPasswordSchema
} from "@/features/auth/validators";
import { authClient } from "@/lib/auth-client";

type ResetPasswordFormProps = {
    token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token,
            newPassword: "",
            confirmPassword: ""
        }
    });

    async function onSubmit({ newPassword }: ResetPasswordSchema) {
        setIsLoading(true);
        try {
            const { error } = await authClient.resetPassword({
                newPassword,
                token
            });
            if (error) throw new Error(error.message);
            toast.success("Password reset successfully.");
            form.reset({ token, newPassword: "", confirmPassword: "" });
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <FormWrapper>
            <CardHeader>
                <TopRoundIcon LucideIcon={KeyRound} />
                <h1 className="font-medium text-2xl">Reset password</h1>
            </CardHeader>
            <CardContent>
                <form
                    id="reset-password-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup className="-space-y-4">
                        <Controller
                            name="newPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="reset-new-password">
                                        New password
                                    </FieldLabel>
                                    <InputPassword
                                        {...field}
                                        id="reset-new-password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="reset-new-password-error"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="reset-new-password-error"
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="reset-confirm-password">
                                        Confirm password
                                    </FieldLabel>
                                    <InputPassword
                                        {...field}
                                        id="reset-confirm-password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="reset-confirm-password-error"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="reset-confirm-password-error"
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
                <section className="w-full">
                    <Button
                        type="submit"
                        form="reset-password-form"
                        disabled={isLoading}
                        className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {isLoading ? (
                            <Loader className="size-4.5 animate-[spin_2s_linear_infinite]" />
                        ) : (
                            <KeyRound className="size-4.5" />
                        )}
                        Reset password
                    </Button>
                    <div className="mt-4 text-center">
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center gap-2 font-medium hover:underline"
                        >
                            <ArrowLeft className="size-4" />
                            Back to sign in
                        </Link>
                    </div>
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
