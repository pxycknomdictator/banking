import { userSession } from "@/dal/auth";
import { SignOut } from "@/features/auth/components/SignOut";

export default async function Dashboard() {
    await userSession();
    return (
        <div className="m-4 flex items-center justify-between">
            <h1 className="font-medium text-2xl">Dashboard page</h1>
            <SignOut />
        </div>
    );
}
