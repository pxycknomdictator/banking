"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint, LogIn } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { type SignInSchema, signInSchema } from "@/features/auth/validation";

export function SigninForm() {
    useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "", rememberMe: false },
    });

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={LogIn} />
                <FormHeader
                    title="Sign in form"
                    description="Enter your credentials"
                />
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
                <div className="w-full space-y-5.5">
                    <div className="space-y-3">
                        <Button
                            type="submit"
                            variant={"default"}
                            className="py-7 w-full font-semibold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Sign in
                        </Button>
                        <Button
                            type="button"
                            variant={"outline"}
                            className="py-7 w-full font-semibold space-x-1 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Fingerprint />
                            Sign in with Passkeys
                        </Button>
                    </div>
                    <div className="text-center font-medium md:font-normal">
                        Don't have an account?{" "}
                        <Link
                            className="hover:underline font-semibold lg:font-medium"
                            href={"/sign-up"}
                        >
                            Sign up
                        </Link>
                    </div>
                    <SocialProviders />
                </div>
            </CardFooter>
        </FormWrapper>
    );
}
