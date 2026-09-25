import { checkTwoFactorAuth } from "@/dal/auth";
import { TwoFactorRecoveryCodeForm } from "@/features/auth/components/forms/TwoFactorRecoveryCodeForm";

export default async function RecoveryCode() {
    await checkTwoFactorAuth();
    return (
        <div className="p-4">
            <TwoFactorRecoveryCodeForm />
        </div>
    );
}
