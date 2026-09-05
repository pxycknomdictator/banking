import { twoFactorSession } from "@/dal/auth";
import { RecoveryForm } from "@/features/auth/components/forms/RecoveryForm";

export default async function RecoveryCodePage() {
    await twoFactorSession();

    return <RecoveryForm />;
}
