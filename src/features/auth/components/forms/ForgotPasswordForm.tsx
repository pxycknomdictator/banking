"use client";

import Link from "next/link";
import { LucideKey } from "lucide-react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundIcon } from "@/features/auth/components/FormRoundIcon";
import { FormWrapper } from "@/features/auth/components/FormWrapper";

export function ForgotPasswordForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundIcon LucideIcon={LucideKey} />
                <FormHeader title="Forgot password form" description="" />
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="text-center my-4">
                        Remember your password?{" "}
                        <Link
                            href={"/sign-in"}
                            className="hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
