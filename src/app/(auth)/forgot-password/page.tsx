import { ForgotPasswordForm } from "@/features/auth/components/forms/ForgotPasswordForm";

export default function ForgotPassword() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Forgot password page</h1>
            <ForgotPasswordForm />
        </div>
    );
}
