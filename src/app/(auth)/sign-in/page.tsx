import { guestGuard } from "@/dal/auth";
import { SignInForm } from "@/features/auth/components/forms/SigninForm";

export default async function Signin() {
    await guestGuard();
    return (
        <div className="m-4">
            <SignInForm />
        </div>
    );
}
