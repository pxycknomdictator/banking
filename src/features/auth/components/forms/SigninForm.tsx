"use client";

import { CardFooter } from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SigninForm() {
    return (
        <FormWrapper>
            <h1 className="text-2xl font-medium">Signin form</h1>
            <CardFooter>
                <SocialProviders />
            </CardFooter>
        </FormWrapper>
    );
}
