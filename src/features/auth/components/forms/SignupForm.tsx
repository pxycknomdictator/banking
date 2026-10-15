"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { TopRoundIcon } from "@/features/auth/components/TopRoundIcon";
import { signupSchema, type SignupSchema } from "@/features/auth/validators";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/features/auth/components/InputPassword";

export function SignUpForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    async function onSubmit(values: SignupSchema) {
        const { name, email, password } = values;
        setIsLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password
            });
            if (error) throw new Error(error.message);
            toast.success("Signup successfully!");
            router.push("/dashboard");
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
                <TopRoundIcon LucideIcon={UserRoundPlus} />
                <h1 className="font-medium text-2xl">Sign up form</h1>
            </CardHeader>
            <CardContent>
                <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="-space-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="signup-name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-name"
                                        type="text"
                                        disabled={isLoading}
                                        className="py-5.75 pl-3"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="signup-name-error"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="signup-name-error"
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="signup-email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="signup-email"
                                        type="email"
                                        autoComplete="email"
                                        className="py-5.75 pl-3"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="signup-email-error"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="signup-email-error"
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
                                    <FieldLabel htmlFor="signup-password">
                                        Password
                                    </FieldLabel>
                                    <InputPassword
                                        {...field}
                                        id="signup-password"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="signup-password-error"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="signup-password-error"
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
                                    <FieldLabel htmlFor="signup-confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <InputPassword
                                        {...field}
                                        id="signup-confirm-password"
                                        aria-invalid={fieldState.invalid}
                                        aria-describedby="signup-confirm-password-error"
                                        disabled={isLoading}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            id="signup-confirm-password-error"
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
                    <div>
                        <Button
                            type="submit"
                            form="signup-form"
                            disabled={isLoading}
                            variant={"default"}
                            className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {isLoading ? (
                                <Loader className="size-4.5 animate-[spin_2s_linear_infinite]" />
                            ) : (
                                <UserRoundPlus className="size-4.5" />
                            )}
                            Sign up
                        </Button>
                    </div>
                    <div className="my-4 text-center">
                        <span className="font-normal">
                            Already have an account?
                        </span>{" "}
                        <Link
                            href={"/sign-in"}
                            className="font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                    <SocialProviders />
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
