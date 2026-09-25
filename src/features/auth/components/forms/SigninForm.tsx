"use client";

import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SigninForm() {
    return (
        <section>
            <h1 className="text-2xl font-medium">Signin form</h1>
            <SocialProviders />
        </section>
    );
}
