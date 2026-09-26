"use client";

import Link from "next/link";
import { UserPlus2 } from "lucide-react";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { FormRoundIcon } from "@/features/auth/components/FormRoundIcon";

export function SignupForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormRoundIcon LucideIcon={UserPlus2} />
                <FormHeader title="Signup form" description="" />
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="text-center my-4">
                        Already have an account?{" "}
                        <Link
                            href={"/sign-in"}
                            className="hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                    <SocialProviders />
                </section>
            </CardFooter>
        </FormWrapper>
    );
}
