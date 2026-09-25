"use client";

import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignupForm() {
    return (
        <section>
            <h1 className="text-2xl font-medium">Signup form</h1>
            <SocialProviders />
        </section>
    );
}
