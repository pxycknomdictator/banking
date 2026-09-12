"use client";

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FormWrapper } from "@/features/auth/components/FormWrapper";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SigninForm() {
    return (
        <FormWrapper>
            <CardHeader>
                <CardTitle>Sign in form</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
                <SocialProviders />
            </CardFooter>
        </FormWrapper>
    );
}
