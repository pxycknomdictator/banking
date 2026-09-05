import { verifiedSession } from "@/dal/auth";

export default async function DashboardPage() {
    await verifiedSession();

    return (
        <div className="p-4">
            <h1 className="font-medium text-2xl">Dashboard page</h1>
        </div>
    );
}
