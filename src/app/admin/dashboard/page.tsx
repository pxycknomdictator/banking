import { adminSession } from "@/dal/auth";

export default async function AdminDashboard() {
    await adminSession();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">Admin Dashboard page</h1>
        </div>
    );
}
