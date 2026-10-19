import { twoFactorGuard } from "@/dal/auth";
import { RecoveryCodeForm } from "@/features/auth/components/forms/RecoveryCodeForm";

export default async function RecoveryCode() {
    await twoFactorGuard();

    return (
        <div className="m-4">
            <RecoveryCodeForm />
        </div>
    );
}
