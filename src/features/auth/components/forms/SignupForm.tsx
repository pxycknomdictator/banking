"use client";

import Link from "next/link";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignUpForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <h1 className="font-medium text-2xl">Sign up form</h1>
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="my-4 text-center">
                        <span className="font-normal">
                            Already have an account?
                        </span>{" "}
                        <Link
                            href={"/sign-in"}
                            className="font-medium hover:underline"
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
