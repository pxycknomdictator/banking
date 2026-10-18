"use client";

import {
    OTPInput,
    OTPInputContext
} from "input-otp";
import { useContext } from "react";
import { cn } from "cn";

function InputOTP({
    className,
    containerClassName,
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}) {
    return (
        <OTPInput
            containerClassName={cn(
                "flex items-center gap-2 has-[:disabled]:opacity-50",
                containerClassName
            )}
            className={cn("disabled:cursor-not-allowed", className)}
            {...props}
        />
    );
}

function InputOTPGroup({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("grid w-full grid-cols-6", className)}
            {...props}
        />
    );
}

function InputOTPSlot({
    index,
    className,
    ...props
}: React.ComponentProps<"div"> & { index: number }) {
    const inputOTPContext = useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } =
        inputOTPContext.slots[index] ?? {};

    return (
        <div
            data-active={isActive}
            className={cn(
                "relative flex h-12 w-full items-center justify-center border-y border-r border-input text-sm shadow-xs first:rounded-l-md first:border-l last:rounded-r-md",
                "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50",
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-pulse bg-foreground" />
                </div>
            )}
        </div>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
