"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SocialProviders() {
    const pathname = usePathname();

    type SocialProvider = "google" | "github" | "discord";

    type SocialProviderList = {
        id: SocialProvider;
        text: "Google" | "Github" | "Discord";
        URL: string;
    };

    const socialProviderList: Array<SocialProviderList> = [
        { id: "google", text: "Google", URL: "/google.svg" },
        { id: "github", text: "Github", URL: "/github.svg" },
        { id: "discord", text: "Discord", URL: "/discord.svg" }
    ];

    const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(
        null
    );

    async function signInWithSocialProvider(provider: SocialProvider) {
        setSocialProvider(provider);
        console.log({ provider });
    }

    return (
        <section className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4">
            {socialProviderList.map(({ id, text, URL }) => (
                <Button
                    key={id}
                    variant={"outline"}
                    disabled={socialProvider !== null}
                    onClick={() => signInWithSocialProvider(id)}
                    className="font-semibold md:font-medium py-6.75 cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 gap-x-2 relative"
                >
                    {pathname === "/sign-in" && (
                        <Badge className="absolute -top-2.75 -right-2 font-medium">
                            Last used
                        </Badge>
                    )}
                    {socialProvider !== id ? (
                        <Image
                            src={URL}
                            alt={id}
                            width={22}
                            height={22}
                            className="w-5.5 h-auto"
                        />
                    ) : (
                        <Loader
                            style={{ width: 22, height: 22 }}
                            className="animate-[spin_1.5s_linear_infinite]"
                        />
                    )}
                    {text}
                </Button>
            ))}
        </section>
    );
}
