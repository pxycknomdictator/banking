"use client";

import Link from "next/link";
import { ShieldLockIcon } from "lucide-react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundIcon } from "@/features/auth/components/FormRoundIcon";
import { FormWrapper } from "@/features/auth/components/FormWrapper";

export function TwoFactorRecoveryCodeForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundIcon LucideIcon={ShieldLockIcon} />
                <FormHeader title="Recovery code form" description="" />
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="text-center my-4">
                        Have access to the app?{" "}
                        <Link
                            href={"/two-factor/totp-verify"}
                            className="hover:underline font-medium"
                        >
                            Authentication app
                        </Link>
                    </div>
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
