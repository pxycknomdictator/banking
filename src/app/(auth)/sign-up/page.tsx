import { authSession } from "@/dal/auth";
import { SignupForm } from "@/features/auth/components/forms/SignupForm";

export default async function SignupPage() {
    await authSession();

    return <SignupForm />;
}
