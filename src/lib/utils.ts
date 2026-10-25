export { cn } from "cn";
import { type BETTER_AUTH_DAL } from "@/dal/auth";
import { redirect } from "next/navigation";
import { type Area } from "react-easy-crop";

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

export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject(new Error("The selected image could not be read."));
        });
        reader.addEventListener("error", () =>
            reject(new Error("The selected image could not be read."))
        );
        reader.readAsDataURL(file);
    });
}

export function createCroppedImage(
    image: string,
    crop: Area,
    rotation: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const source = new window.Image();
        source.onload = () => {
            const radians = (rotation * Math.PI) / 180;
            const rotatedCanvas = document.createElement("canvas");
            const rotatedWidth =
                Math.abs(Math.cos(radians) * source.naturalWidth) +
                Math.abs(Math.sin(radians) * source.naturalHeight);
            const rotatedHeight =
                Math.abs(Math.sin(radians) * source.naturalWidth) +
                Math.abs(Math.cos(radians) * source.naturalHeight);
            rotatedCanvas.width = Math.round(rotatedWidth);
            rotatedCanvas.height = Math.round(rotatedHeight);

            const rotatedContext = rotatedCanvas.getContext("2d");
            if (!rotatedContext) {
                reject(new Error("Could not prepare the cropped image."));
                return;
            }

            rotatedContext.translate(
                rotatedCanvas.width / 2,
                rotatedCanvas.height / 2
            );
            rotatedContext.rotate(radians);
            rotatedContext.drawImage(
                source,
                -source.naturalWidth / 2,
                -source.naturalHeight / 2
            );

            const canvas = document.createElement("canvas");
            canvas.width = crop.width;
            canvas.height = crop.height;
            const context = canvas.getContext("2d");
            if (!context) {
                reject(new Error("Could not prepare the cropped image."));
                return;
            }

            context.drawImage(
                rotatedCanvas,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                crop.width,
                crop.height
            );
            resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        source.onerror = () =>
            reject(new Error("Could not prepare the cropped image."));
        source.src = image;
    });
}
