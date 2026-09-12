import type { LucideIcon } from "lucide-react";

type FormRoundBadgeProps = {
    Lucide: LucideIcon;
};

export function FormRoundBadge({ Lucide }: FormRoundBadgeProps) {
    return (
        <div className="w-full flex items-center justify-center pt-2 pb-4">
            <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center">
                <Lucide color="white" />
            </div>
        </div>
    );
}
