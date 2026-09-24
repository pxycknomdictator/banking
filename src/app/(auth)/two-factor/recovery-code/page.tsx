import { checkTwoFactorAuth } from "@/dal/auth";

export default async function RecoveryCode() {
    await checkTwoFactorAuth();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">Recovery code page</h1>
        </div>
    );
}
