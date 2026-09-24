import { verifiedSession } from "@/dal/auth";

export default async function Dashboard() {
    const { user } = await verifiedSession();
    return (
        <div className="p-4">
            <h1 className="text-2xl font-medium">
                Welcome {user.name}! to the Dashboard page
            </h1>
        </div>
    );
}
