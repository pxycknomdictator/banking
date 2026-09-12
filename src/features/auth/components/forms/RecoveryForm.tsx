"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormWrapper } from "@/features/auth/components/FormWrapper";

export function RecoveryForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormHeader
                    title="Recovery form"
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
                        Verify code
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
