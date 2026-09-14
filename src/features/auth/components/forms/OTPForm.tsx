"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldKeyhole } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import {
    type TwoFactorOTPSchema,
    twoFactorOTPSchema,
} from "@/features/auth/validation";

export function OTPForm() {
    const form = useForm<TwoFactorOTPSchema>({
        resolver: zodResolver(twoFactorOTPSchema),
        defaultValues: { code: "", trustDevice: false },
    });

    async function onSubmit({ code, trustDevice }: TwoFactorOTPSchema) {
        console.log({ code, trustDevice });
    }

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={ShieldKeyhole} />
                <FormHeader
                    title="OTP form"
                    description="Enter your credentials"
                />
            </CardHeader>
            <CardContent>
                <form
                    id="two-factor-otp-form"
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
                        Verify OTP
                    </Button>
                    <div className="text-center font-medium md:font-normal">
                        Having trouble verifying?{" "}
                        <Link
                            className="hover:underline font-semibold lg:font-medium"
                            href={"/two-factor/totp-verify"}
                        >
                            Authenticator app
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </FormWrapper>
    );
}
