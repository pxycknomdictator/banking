"use client";

import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignInForm() {
    return (
        <section>
            <h1 className="font-medium text-2xl">Sign in form</h1>
            <SocialProviders />
        </section>
    );
}
