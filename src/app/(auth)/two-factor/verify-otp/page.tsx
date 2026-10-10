import { TwoFactorOTPForm } from "@/features/auth/components/forms/TwoFactorOTPForm";

export default function VerifyOTP() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Verify OTP page</h1>
            <TwoFactorOTPForm />
        </div>
    );
}
