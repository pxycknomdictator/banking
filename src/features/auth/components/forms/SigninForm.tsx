"use client";

import Link from "next/link";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignInForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <h1 className="font-medium text-2xl">Sign in form</h1>
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div className="my-4 text-center">
                        <span className="font-normal">
                            Don't have an account?
                        </span>{" "}
                        <Link
                            href={"/sign-up"}
                            className="font-medium hover:underline"
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
