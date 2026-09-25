import { checkTwoFactorAuth } from "@/dal/auth";
import { TwoFactorTOTPForm } from "@/features/auth/components/forms/TwoFactorTOTPForm";

export default async function TOTPVerify() {
    await checkTwoFactorAuth();
    return (
        <div className="p-4">
            <TwoFactorTOTPForm />
        </div>
    );
}
