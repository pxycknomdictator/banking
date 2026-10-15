"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Fingerprint, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { TopRoundIcon } from "@/features/auth/components/TopRoundIcon";
import { signinSchema, type SigninSchema } from "@/features/auth/validators";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/features/auth/components/InputPassword";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLastUsedMethod } from "@/features/auth/hooks/lastUsedMethod";

export function SignInForm() {
    const method = useLastUsedMethod();

    const form = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema),
        defaultValues: { email: "", password: "", rememberMe: false }
    });

    async function onSubmit({ email, password, rememberMe }: SigninSchema) {
        console.log({ email, password, rememberMe });
    }

    return (
        <FormWrapper>
            <CardHeader>
                <TopRoundIcon LucideIcon={LogIn} />
                <h1 className="font-medium text-2xl">Sign in form</h1>
            </CardHeader>
            <CardContent>
                <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="-space-y-4">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="form-rhf-demo-title">
                                            Email
                                        </FieldLabel>
                                        {method === "email" && (
                                            <Badge className="font-semibold text-[10px]">
                                                Last used
                                            </Badge>
                                        )}
                                    </div>
                                    <Input
                                        {...field}
                                        type="email"
                                        className="py-5.75 pl-3"
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
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <div className="flex items-center justify-between">
                                        <FieldLabel htmlFor="form-rhf-demo-title">
                                            Password
                                        </FieldLabel>
                                        <Link
                                            href={"/forgot-password"}
                                            className="font-medium hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <InputPassword
                                        {...field}
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
                        <Controller
                            name="rememberMe"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    orientation={"horizontal"}
                                    className="gap-x-3 items-center w-fit"
                                    data-invalid={fieldState.invalid}
                                >
                                    <Checkbox
                                        id="remember_me"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel
                                        htmlFor="remember_me"
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        Remember me
                                    </FieldLabel>
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
                <section className="w-full">
                    <div className="grid gap-y-3">
                        <Button
                            type="submit"
                            form="signin-form"
                            variant={"default"}
                            className="py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            Sign in
                        </Button>
                        <Button
                            type="button"
                            variant={"outline"}
                            className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <Fingerprint /> Sign in with Passkey
                        </Button>
                    </div>
                    <div className="my-4 text-center">
                        <span className="font-normal">
                            Don&apos;t have an account?
                        </span>{" "}
                        <Link
                            href={"/sign-up"}
                            className="font-medium hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                    <SocialProviders />
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
