import { adminSession } from "@/dal/auth";

export default async function AdminDashboardPage() {
    await adminSession();

    return (
        <div className="p-4">
            <h1 className="font-medium text-2xl">Admin dashboard page</h1>
        </div>
    );
}
