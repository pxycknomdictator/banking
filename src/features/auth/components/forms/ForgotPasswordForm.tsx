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
    useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={LucideKey} />
                <FormHeader
                    title="Forgot password form"
                    description="Enter your credentials"
                />
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
                <div className="w-full space-y-5.5">
                    <Button
                        type="submit"
                        variant={"default"}
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
