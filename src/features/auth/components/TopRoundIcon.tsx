import { type LucideIcon } from "lucide-react";

type TopRoundIconProps = {
    LucideIcon: LucideIcon;
};

export function TopRoundIcon({ LucideIcon }: TopRoundIconProps) {
    return (
        <div className="flex items-center justify-center">
            <div className="bg-primary size-16 rounded-full flex items-center justify-center mt-2 mb-4">
                <LucideIcon color="white" />
            </div>
        </div>
    );
}
