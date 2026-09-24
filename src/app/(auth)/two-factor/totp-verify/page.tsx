import { checkTwoFactorAuth } from "@/dal/auth";

export default async function TOTPVerify() {
    await checkTwoFactorAuth();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">TOTP Verify page</h1>
        </div>
    );
}
