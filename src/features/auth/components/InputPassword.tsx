"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, type ComponentProps } from "react";

type InputPasswordProps = ComponentProps<"input">;

export function InputPassword(props: InputPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                aria-label="Password"
                type={showPassword ? "text" : "password"}
                className="py-5.75 pl-3"
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1/2 size-8 -translate-y-1/2 cursor-pointer"
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}
