import { twoFactorSession } from "@/dal/auth";
import { OTPForm } from "@/features/auth/components/forms/OTPForm";

export default async function OTPVerifyPage() {
    await twoFactorSession();

    return <OTPForm />;
}
