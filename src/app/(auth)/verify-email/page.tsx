import { unverifiedSession } from "@/dal/auth";
import { VerifyEmailForm } from "@/features/auth/components/forms/VerifyEmailForm";

export default async function VerifyEmail() {
    await unverifiedSession();
    return (
        <div className="p-4">
            <VerifyEmailForm />
        </div>
    );
}
