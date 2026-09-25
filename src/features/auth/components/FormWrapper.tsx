import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type FormWrapperProps = {
    children: ReactNode;
};

export function FormWrapper({ children }: FormWrapperProps) {
    return <Card>{children}</Card>;
}
