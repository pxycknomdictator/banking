"use client";

import Link from "next/link";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";
import { TopRoundIcon } from "@/features/auth/components/TopRoundIcon";

export function SignUpForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <TopRoundIcon LucideIcon={UserRoundPlus} />
                <h1 className="font-medium text-2xl">Sign up form</h1>
            </CardHeader>
            <CardFooter>
                <section className="w-full">
                    <div>
                        <Button
                            type="submit"
                            variant={"default"}
                            className="w-full py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            Sign up
                        </Button>
                    </div>
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
