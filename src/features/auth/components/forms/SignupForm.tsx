"use client";

import { UserPlus2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormRoundBadge } from "@/features/auth/components/FormRoundBadge";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignupForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundBadge Lucide={UserPlus2Icon} />
                <FormHeader
                    title="Sign up form"
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
                        Sign up
                    </Button>
                    <div className="text-center font-medium md:font-normal">
                        Already have an account?{" "}
                        <Link
                            className="hover:underline font-semibold lg:font-medium"
                            href={"/sign-in"}
                        >
                            Sign in
                        </Link>
                    </div>
                    <SocialProviders />
                </div>
            </CardFooter>
        </FormWrapper>
    );
}
