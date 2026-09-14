"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import {
    type ResetPasswordSchema,
    resetPasswordSchema,
} from "@/features/auth/validation";

export function ResetPasswordForm() {
    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: "", confirmPassword: "", token: "" },
    });

    async function onSubmit({ newPassword, token }: ResetPasswordSchema) {
        console.log({ newPassword, token });
    }

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={UserRoundPen} />
                <FormHeader
                    title="Reset password form"
                    description="Enter your credentials"
                />
            </CardHeader>
            <CardContent>
                <form
                    id="reset-password-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                ></form>
            </CardContent>
            <CardFooter>
                <div className="w-full space-y-5.5">
                    <Button
                        type="submit"
                        variant={"default"}
                        className="py-7 w-full font-semibold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Change password
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
