"use client";

import { CardFooter, CardHeader } from "@/components/ui/card";
import { FormHeader } from "@/features/auth/components/FormHeader";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SigninForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <FormHeader title="Signin form" description="" />
            </CardHeader>
            <CardFooter>
                <SocialProviders />
            </CardFooter>
        </FormWrapper>
    );
}
