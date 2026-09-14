"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideKey } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import {
    type ForgotPasswordSchema,
    forgotPasswordSchema,
} from "@/features/auth/validation";

export function ForgotPasswordForm() {
    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit({ email }: ForgotPasswordSchema) {
        console.log({ email });
    }

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={LucideKey} />
                <FormHeader
                    title="Forgot password form"
                    description="Enter your credentials"
                />
            </CardHeader>
            <CardContent>
                <form
                    id="forgot-password-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                ></form>
            </CardContent>
            <CardFooter>
                <div className="w-full space-y-5.5">
                    <Button
                        type="submit"
                        variant={"default"}
                        form="forgot-password-form"
                        className="py-7 w-full font-semibold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Reset password
                    </Button>
                    <div className="text-center font-medium md:font-normal">
                        Remember your password?{" "}
                        <Link
                            className="hover:underline font-semibold lg:font-medium"
                            href={"/sign-in"}
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </FormWrapper>
    );
}
