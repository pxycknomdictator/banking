import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userSession } from "@/dal/auth";
import { SignOut } from "@/features/auth/components/SignOut";
import { EnableTwoFactor } from "@/features/auth/components/EnableTwoFactor";
import { ProfileImage } from "@/features/profile/components/ProfileImage";

export default async function Dashboard() {
    const session = await userSession();
    const accounts = await auth.api.listUserAccounts({
        headers: await headers()
    });
    const hasPasswordAccount = accounts.some(
        (account) => account.providerId === "credential"
    );
    return (
        <div className="m-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-2xl">Dashboard page</h1>
                <SignOut />
            </div>
            <ProfileImage name={session.user.name} image={session.user.image} />
            {hasPasswordAccount && (
                <EnableTwoFactor
                    initiallyEnabled={session.user.twoFactorEnabled ?? false}
                />
            )}
        </div>
    );
}
