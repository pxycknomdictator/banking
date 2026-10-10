import { SignUpForm } from "@/features/auth/components/forms/SignupForm";

export default function Signup() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Sign up page</h1>
            <SignUpForm />
        </div>
    );
}
