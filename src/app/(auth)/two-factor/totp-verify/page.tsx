import { twoFactorSession } from "@/dal/auth";
import { TOTPForm } from "@/features/auth/components/forms/TOTPForm";

export default async function TOTPVerifyPage() {
    await twoFactorSession();

    return <TOTPForm />;
}
