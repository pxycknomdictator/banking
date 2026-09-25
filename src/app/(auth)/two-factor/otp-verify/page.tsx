import { checkTwoFactorAuth } from "@/dal/auth";
import { TwoFactorOTPForm } from "@/features/auth/components/forms/TwoFactorOTPForm";

export default async function OTPVerify() {
    await checkTwoFactorAuth();
    return (
        <div className="p-4">
            <TwoFactorOTPForm />
        </div>
    );
}
