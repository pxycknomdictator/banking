"use client";

import Link from "next/link";
import { Smartphone } from "lucide-react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundIcon } from "@/features/auth/components/FormRoundIcon";
import { FormWrapper } from "@/features/auth/components/FormWrapper";

export function TwoFactorTOTPForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundIcon LucideIcon={Smartphone} />
                <FormHeader title="Two Factor TOTP form" description="" />
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="text-center my-4">
                        Don't have access to the app?{" "}
                        <Link
                            href={"/two-factor/recovery-code"}
                            className="hover:underline font-medium"
                        >
                            Recovery code
                        </Link>
                    </div>
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
