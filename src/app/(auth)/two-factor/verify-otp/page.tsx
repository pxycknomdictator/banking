import { twoFactorGuard } from "@/dal/auth";
import { TwoFactorOTPForm } from "@/features/auth/components/forms/TwoFactorOTPForm";

export default async function VerifyOTP() {
    await twoFactorGuard();

    return (
        <div className="m-4">
            <TwoFactorOTPForm />
        </div>
    );
}
