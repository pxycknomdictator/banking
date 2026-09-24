import { checkTwoFactorAuth } from "@/dal/auth";

export default async function OTPVerify() {
    await checkTwoFactorAuth();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">OTP Verify page</h1>
        </div>
    );
}
