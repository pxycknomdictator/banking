export { cn } from "cn";
import { type BETTER_AUTH_DAL } from "@/dal/auth";
import { redirect } from "next/navigation";

export function checkRoleAndRedirect(session: BETTER_AUTH_DAL) {
    switch (session.user.role) {
        case "user":
            redirect("/dashboard");
        case "manager":
            redirect("/manager/dashboard");
        case "admin":
            redirect("/admin/dashboard");
        default:
            redirect("/sign-in");
    }
}

export function getDashboardPath(role: string | null | undefined): string {
    switch (role) {
        case "admin":
            return "/admin/dashboard";
        case "manager":
            return "/manager/dashboard";
        case "user":
            return "/dashboard";
        default:
            return "/unauthorized";
    }
}
