import { unverifiedSession } from "@/dal/auth";

export default async function VerifyEmail() {
    await unverifiedSession();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">Verify email page</h1>
        </div>
    );
}
