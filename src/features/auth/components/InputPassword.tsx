"use client";

import { EyeIcon, EyeOff } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Input } from "@/components/ui/input";

type InputPasswordProps = ComponentProps<"input">;

export function InputPassword({ ...props }: InputPasswordProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="relative">
            <Input
                className="py-5.5 pl-3"
                type={showPassword ? "text" : "password"}
                {...props}
            />
            <button
                type="button"
                className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? (
                    <EyeIcon className="size-5" />
                ) : (
                    <EyeOff className="size-5" />
                )}
            </button>
        </div>
    );
}
