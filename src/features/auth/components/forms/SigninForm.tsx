"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Fingerprint, Loader, LogIn } from "lucide-react";
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
    const router = useRouter();
    const method = useLastUsedMethod();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema),
        defaultValues: { email: "", password: "", rememberMe: false }
    });

    async function onSubmit({ email, password, rememberMe }: SigninSchema) {
        setIsLoading(true);
        try {
            const { error, data } = await authClient.signIn.email({
                email,
                password,
                rememberMe
            });
            if (error) throw new Error(error.message);
            if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
                router.push("/two-factor/verify-totp");
                return;
            }
            toast.success("Signed in successfully!");
            router.push(getDashboardPath(data.user.role));
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
                                        <FieldLabel htmlFor="signin-email">
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
                                        id="signin-email"
                                        type="email"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        className="py-5.75 pl-3"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="signin-email-error"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="signin-email-error"
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
                                        <FieldLabel htmlFor="signin-password">
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
                                        id="signin-password"
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="signin-password-error"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="signin-password-error"
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
                                        id="signin-remember-me"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isLoading}
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <FieldLabel
                                        htmlFor="signin-remember-me"
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
                            disabled={isLoading}
                            className="py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {isLoading ? (
                                <Loader className="size-4.5 animate-[spin_2s_linear_infinite]" />
                            ) : (
                                <LogIn className="size-4.5" />
                            )}
                            Sign in
                        </Button>
                        <Button
                            type="button"
                            variant={"outline"}
                            disabled={isLoading}
                            className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <Fingerprint data-icon="inline-start" /> Sign in
                            with Passkey
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
