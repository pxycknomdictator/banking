import { userSession } from "@/dal/auth";

export default async function Dashboard() {
    await userSession();
    return (
        <div className="m-4">
            <h1 className="font-medium text-2xl">Dashboard page</h1>
        </div>
    );
}
