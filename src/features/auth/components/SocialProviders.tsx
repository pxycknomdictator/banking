"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useLastUsedMethod } from "@/features/auth/hooks/lastUsedMethod";

export function SocialProviders() {
    const method = useLastUsedMethod();

    type SocialProvider = "google" | "github" | "discord";

    const [whichLoading, setWhichLoading] = useState<SocialProvider | null>(
        null
    );

    type SocialProviderList = {
        id: SocialProvider;
        text: "Google" | "Github" | "Discord";
        URL: string;
    };

    const SOCIAL_PROVIDER_LIST: Array<SocialProviderList> = [
        { id: "google", text: "Google", URL: "/google.svg" },
        { id: "github", text: "Github", URL: "/github.svg" },
        { id: "discord", text: "Discord", URL: "/discord.svg" }
    ];

    async function signInWithSocialProvider(provider: SocialProvider) {
        setWhichLoading(provider);
        try {
            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: "/auth/redirect"
            });
            if (error) throw new Error(error.message);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            console.error(msg);
        } finally {
            setWhichLoading(null);
        }
    }

    return (
        <section className="w-full grid gap-y-3.5 lg:grid-cols-3 lg:gap-x-4">
            {SOCIAL_PROVIDER_LIST.map(({ id, text, URL }) => (
                <Button
                    key={id}
                    type="button"
                    variant={"outline"}
                    disabled={whichLoading !== null}
                    onClick={() => signInWithSocialProvider(id)}
                    className="py-7 font-semibold gap-x-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 relative"
                >
                    {method === id && (
                        <Badge className="absolute -top-2.75 -right-2.5 font-medium">
                            Last used
                        </Badge>
                    )}
                    {whichLoading === id ? (
                        <Loader className="size-6 animate-[spin_2s_linear_infinite]" />
                    ) : (
                        <Image
                            src={URL}
                            alt={id}
                            width={24}
                            height={24}
                            className="h-6 w-6"
                        />
                    )}
                    <span>{text}</span>
                </Button>
            ))}
        </section>
    );
}
