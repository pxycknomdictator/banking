import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { twoFactors } from "@/db/schemas";
import { userSession } from "@/dal/auth";
import { SignOut } from "@/features/auth/components/SignOut";
import { EnableTwoFactor } from "@/features/auth/components/EnableTwoFactor";
import { EmailVerification } from "@/features/auth/components/EmailVerification";
import { ProfileImage } from "@/features/profile/components/ProfileImage";

export default async function Dashboard() {
    const session = await userSession();
    const accounts = await auth.api.listUserAccounts({
        headers: await headers()
    });
    const hasPasswordAccount = accounts.some(
        (account) => account.providerId === "credential"
    );
    const totpFactor = await db.query.twoFactors.findFirst({
        where: eq(twoFactors.userId, session.user.id),
        columns: { id: true }
    });

    return (
        <div className="m-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-2xl">Dashboard page</h1>
                <SignOut />
            </div>
            <ProfileImage name={session.user.name} image={session.user.image} />
            <EmailVerification
                email={session.user.email}
                emailVerified={session.user.emailVerified}
            />
            {hasPasswordAccount && (
                <EnableTwoFactor
                    initiallyEnabled={session.user.twoFactorEnabled ?? false}
                    initiallySelectedMethod={
                        session.user.twoFactorEnabled
                            ? totpFactor
                                ? "totp"
                                : "otp"
                            : "totp"
                    }
                />
            )}
        </div>
    );
}
