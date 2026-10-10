import { SignInForm } from "@/features/auth/components/forms/SigninForm";

export default function Signin() {
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Sign in page</h1>
            <SignInForm />
        </div>
    );
}
