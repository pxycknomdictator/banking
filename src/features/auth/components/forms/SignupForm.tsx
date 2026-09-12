"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SocialProviders } from "@/features/auth/components/SocialProviders";

export function SignupForm() {
    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Sign up form</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter>
                    <SocialProviders />
                </CardFooter>
            </Card>
        </div>
    );
}
