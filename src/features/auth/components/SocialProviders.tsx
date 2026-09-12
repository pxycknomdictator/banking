import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SocialProviders() {
    type SocialProviderList = {
        id: "google" | "github" | "discord";
        text: "Google" | "Github" | "Discord";
        src: string;
    };

    const socialProviderList: Array<SocialProviderList> = [
        { id: "google", text: "Google", src: "/google.svg" },
        { id: "github", text: "Github", src: "/github.svg" },
        { id: "discord", text: "Discord", src: "/discord.svg" },
    ];

    return (
        <section className="w-full grid grid-cols-1 mb-2 gap-y-4 md:grid-cols-3 gap-x-4">
            {socialProviderList.map(({ id, text, src }) => (
                <Button
                    key={id}
                    type="button"
                    variant={"outline"}
                    className="relative py-7 space-x-1 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                >
                    <Badge
                        variant="default"
                        className="absolute -top-2.5 -right-3 font-semibold md:font-medium"
                    >
                        Last used
                    </Badge>
                    <Image src={src} alt={id} width={25} height={25} />
                    <span className="block font-semibold lg:font-medium">
                        {text}
                    </span>
                </Button>
            ))}
        </section>
    );
}
