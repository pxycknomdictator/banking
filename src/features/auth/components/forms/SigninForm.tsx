"use client";

import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { FormRoundIcon } from "@/features/auth/components/FormRoundIcon";

export function SigninForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundIcon LucideIcon={LogInIcon} />
                <FormHeader title="Signin form" description="" />
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="text-center my-4">
                        Don't have an account?{" "}
                        <Link
                            href={"/sign-up"}
                            className="hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                    <SocialProviders />
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
