"use client";

import Link from "next/link";
import { UserShieldIcon } from "lucide-react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundIcon } from "@/features/auth/components/FormRoundIcon";
import { FormWrapper } from "@/features/auth/components/FormWrapper";

export function TwoFactorOTPForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundIcon LucideIcon={UserShieldIcon} />
                <FormHeader title="Two Factor OTP form" description="" />
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="text-center my-4">
                        Didn't get the OTP?{" "}
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
