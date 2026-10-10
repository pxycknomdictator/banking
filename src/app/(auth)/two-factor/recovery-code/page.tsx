import { RecoveryCodeForm } from "@/features/auth/components/forms/RecoveryCodeForm";

export default function RecoveryCode() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Recovery code page</h1>
            <RecoveryCodeForm />
        </div>
    );
}
