"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserRoundPlus } from "lucide-react";
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
    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    async function onSubmit({ name, email, password }: SignupSchema) {
        console.log({ name, email, password });
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
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
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
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Email
                                    </FieldLabel>
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
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Password
                                    </FieldLabel>
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
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="-space-y-1.5"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Confirm Password
                                    </FieldLabel>
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
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <section className="w-full">
                    <div>
                        <Button
                            type="submit"
                            form="signup-form"
                            variant={"default"}
                            className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
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
