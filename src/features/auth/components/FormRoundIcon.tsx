import type { LucideIcon } from "lucide-react";

type FormRoundIconProps = {
    LucideIcon: LucideIcon;
};

export function FormRoundIcon({ LucideIcon }: FormRoundIconProps) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="bg-primary rounded-full flex items-center justify-center size-14.5">
                <LucideIcon color="white" />
            </div>
        </div>
    );
}
