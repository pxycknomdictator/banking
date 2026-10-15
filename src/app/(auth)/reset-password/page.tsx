import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth/components/forms/ResetPasswordForm";

type ResetPasswordPageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function ResetPassword({
    searchParams
}: ResetPasswordPageProps) {
    const { token } = await searchParams;

    if (!token) {
        redirect("/forgot-password");
    }

    return (
        <div className="m-4">
            <ResetPasswordForm token={token} />
        </div>
    );
}
