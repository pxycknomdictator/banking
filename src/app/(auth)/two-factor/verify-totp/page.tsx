import { twoFactorGuard } from "@/dal/auth";
import { TwoFactorTOTPForm } from "@/features/auth/components/forms/TwoFactorTOTPForm";

export default async function VerifyTOTP() {
    await twoFactorGuard();

    return (
        <div className="m-4">
            <TwoFactorTOTPForm />
        </div>
    );
}
