"use client";

import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignupForm() {
    return (
        <div className="p-4">
            <h1 className="font-medium text-2xl">Sign up form</h1>
            <SocialProviders />
        </div>
    );
}
