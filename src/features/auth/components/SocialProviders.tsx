"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function SocialProviders() {
    type SocialProvider = "google" | "github" | "discord";

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

    return (
        <section className="grid gap-y-3.5">
            {SOCIAL_PROVIDER_LIST.map(({ id, text, URL }) => (
                <Button
                    key={id}
                    variant={"outline"}
                    className="py-7 font-semibold gap-x-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
                >
                    <Image
                        src={URL}
                        alt={id}
                        width={26}
                        height={26}
                        className="h-6.5 w-6.5"
                    />
                    <span>{text}</span>
                </Button>
            ))}
        </section>
    );
}
