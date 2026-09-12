"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormWrapper } from "@/features/auth/components/FormWrapper";

export function ResetPasswordForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormHeader
                    title="Reset password form"
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
