import { authSession } from "@/dal/auth";
import { SigninForm } from "@/features/auth/components/forms/SigninForm";

export default async function SigninPage() {
    await authSession();

    return <SigninForm />;
}
