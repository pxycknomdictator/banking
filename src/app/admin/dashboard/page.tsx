import { adminSession } from "@/dal/auth";

export default async function AdminDashboard() {
    await adminSession();
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Admin Dashboard page</h1>
        </div>
    );
}
