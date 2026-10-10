"use client";

import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignUpForm() {
    return (
        <section>
            <h1 className="font-medium text-2xl">Sign up form</h1>
            <SocialProviders />
        </section>
    );
}
