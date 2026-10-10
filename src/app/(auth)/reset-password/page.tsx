import { ResetPasswordForm } from "@/features/auth/components/forms/ResetPasswordForm";

export default function ResetPassword() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Reset password page</h1>
            <ResetPasswordForm />
        </div>
    );
}
