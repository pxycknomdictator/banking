import { unverifiedSession } from "@/dal/auth";
import { EmailVerifyForm } from "@/features/auth/components/forms/EmailVerifyForm";

export default async function EmailVerifyPage() {
    await unverifiedSession();

    return <EmailVerifyForm />;
}
