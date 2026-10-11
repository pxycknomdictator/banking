"use client";

import { useState } from "react";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOut() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    async function signOut() {
        setLoading(true);
        try {
            const { error } = await authClient.signOut({
                fetchOptions: { onSuccess: () => router.push("/sign-in") }
            });
            if (error) throw new Error(error.message);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Something went wrong";
            console.error(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={signOut}
            variant={"default"}
            disabled={loading}
            className="py-6 px-5 gap-x-2 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
        >
            {loading ? (
                <>
                    <Loader className="size-4.5 animate-[spin_2s_linear_infinite]" />
                </>
            ) : (
                <>
                    <LogOut />
                    <span>Sign Out</span>
                </>
            )}
        </Button>
    );
}
