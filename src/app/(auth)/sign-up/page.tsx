import { guestGuard } from "@/dal/auth";
import { SignUpForm } from "@/features/auth/components/forms/SignupForm";

export default async function Signup() {
    await guestGuard();
    return (
        <div className="m-4">
            <SignUpForm />
        </div>
    );
}
