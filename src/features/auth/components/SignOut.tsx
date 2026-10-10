"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loading } from "@/features/auth/components/Loading";

export function SignOut() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

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
            className="py-6 px-5 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
        >
            {loading ? (
                <div className="py-6 px-3.5">
                    <Loading />
                </div>
            ) : (
                "Signout"
            )}
        </Button>
    );
}
