"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus2Icon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { type SignUpSchema, signUpSchema } from "@/features/auth/validation";

export function SignupForm() {
    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit({ name, email, password }: SignUpSchema) {
        console.log({ name, email, password });
    }

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={UserPlus2Icon} />
                <FormHeader
                    title="Sign up form"
                    description="Enter your credentials"
                />
            </CardHeader>
            <CardContent>
                <form
                    id="signup-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                ></form>
            </CardContent>
            <CardFooter>
                <div className="w-full space-y-5.5">
                    <Button
                        type="submit"
                        variant={"default"}
                        form="signup-form"
                        className="py-7 w-full font-semibold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Sign up
                    </Button>
                    <div className="text-center font-medium md:font-normal">
                        Already have an account?{" "}
                        <Link
                            className="hover:underline font-semibold lg:font-medium"
                            href={"/sign-in"}
                        >
                            Sign in
                        </Link>
                    </div>
                    <SocialProviders />
                </div>
            </CardFooter>
        </FormWrapper>
    );
}
