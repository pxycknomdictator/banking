"use client";

import Link from "next/link";
import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
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
                    <div className="grid gap-y-3">
                        <Button
                            type="submit"
                            variant={"default"}
                            className="py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            Sign in
                        </Button>
                        <Button
                            type="button"
                            variant={"outline"}
                            className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <Fingerprint /> Sign in with Passkey
                        </Button>
                    </div>
                    <div className="my-4 text-center">
                        <span className="font-normal">
                            Don&apos;t have an account?
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
