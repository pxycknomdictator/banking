"use client";

import { Button } from "@/components/ui/button";

export default function Error({
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground">
                We could not load this page. Please try again.
            </p>
            <Button type="button" onClick={reset}>
                Try again
            </Button>
        </main>
    );
}
