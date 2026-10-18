"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";

function Dialog(props: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
    return <DialogPrimitive.Close {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: DialogPrimitive.Backdrop.Props) {
    return (
        <DialogPrimitive.Backdrop
            className={cn(
                "fixed inset-0 z-50 bg-black/50 data-ending-style:animate-out data-ending-style:fade-out data-starting-style:animate-in data-starting-style:fade-in",
                className
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    ...props
}: DialogPrimitive.Popup.Props) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <DialogPrimitive.Popup
                    className={cn(
                        "relative w-full max-w-lg rounded-xl bg-background p-6 text-foreground shadow-lg outline-none data-ending-style:animate-out data-ending-style:zoom-out-95 data-ending-style:fade-out data-starting-style:animate-in data-starting-style:zoom-in-95 data-starting-style:fade-in",
                        className
                    )}
                    {...props}
                >
                    {children}
                    <DialogPrimitive.Close
                        className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Viewport>
        </DialogPortal>
    );
}

function DialogHeader({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    );
}

function DialogFooter({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props}
        />
    );
}

function DialogTitle({
    className,
    ...props
}: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            className={cn("text-lg font-semibold", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: DialogPrimitive.Description.Props) {
    return (
        <DialogPrimitive.Description
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
};
