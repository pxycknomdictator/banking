"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { TopRoundIcon } from "@/features/auth/components/TopRoundIcon";
import {
    forgotPasswordSchema,
    type ForgotPasswordSchema
} from "@/features/auth/validators";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" }
    });

    async function onSubmit({ email }: ForgotPasswordSchema) {
        setIsLoading(true);
        try {
            const { error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "/reset-password"
            });
            if (error) throw new Error(error.message);
            toast.success("If an account exists, a reset link has been sent.");
            form.reset();
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
                <TopRoundIcon LucideIcon={Mail} />
                <h1 className="font-medium text-2xl">Forgot password</h1>
            </CardHeader>
            <CardContent>
                <form
                    id="forgot-password-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="forgot-password-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="forgot-password-email"
                                        type="email"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        className="py-5.75 pl-3"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="forgot-password-email-error"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="forgot-password-email-error"
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
                        form="forgot-password-form"
                        disabled={isLoading}
                        className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        {isLoading ? (
                            <Loader className="size-4.5 animate-[spin_2s_linear_infinite]" />
                        ) : (
                            <Mail className="size-4.5" />
                        )}
                        Send reset link
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
