import { managerSession } from "@/dal/auth";

export default async function ManagerDashboard() {
    await managerSession();
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Manager Dashboard page</h1>
        </div>
    );
}
