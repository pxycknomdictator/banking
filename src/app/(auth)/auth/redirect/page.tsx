import { getSession } from "@/dal/auth";
import { checkRoleAndRedirect } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Redirect() {
    const session = await getSession();
    if (!session) return redirect("/sign-in");
    checkRoleAndRedirect(session);
}
