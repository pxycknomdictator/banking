import { TwoFactorTOTPForm } from "@/features/auth/components/forms/TwoFactorTOTPForm";

export default function VerifyTOTP() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Verify TOTP page</h1>
            <TwoFactorTOTPForm />
        </div>
    );
}
