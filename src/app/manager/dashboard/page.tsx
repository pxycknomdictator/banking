import { managerSession } from "@/dal/auth";
import { SignOut } from "@/features/auth/components/SignOut";

export default async function ManagerDashboard() {
    await managerSession();
    return (
        <div className="m-4 space-y-4">
            <h1 className="font-medium text-2xl">Manager Dashboard page</h1>
            <div className="flex justify-end">
                <SignOut />
            </div>
        </div>
    );
}
