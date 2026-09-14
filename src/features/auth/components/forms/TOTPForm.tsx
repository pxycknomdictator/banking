"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Smartphone } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import {
    type TwoFactorTOTPSchema,
    twoFactorTOTPSchema,
} from "@/features/auth/validation";

export function TOTPForm() {
    useForm<TwoFactorTOTPSchema>({
        resolver: zodResolver(twoFactorTOTPSchema),
        defaultValues: { code: "", trustDevice: false },
    });

    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={Smartphone} />
                <FormHeader
                    title="TOTP form"
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
                        Verify TOTP
                    </Button>
                    <div className="text-center font-medium md:font-normal">
                        Having trouble verifying?{" "}
                        <Link
                            className="hover:underline font-semibold lg:font-medium"
                            href="/two-factor/recovery-code"
                        >
                            Recovery code
                        </Link>
                    </div>
                </div>
            </CardFooter>
        </FormWrapper>
    );
}
