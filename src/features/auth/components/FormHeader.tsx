import { CardDescription, CardTitle } from "@/components/ui/card";

type FormHeaderProps = {
    title: string;
    description: string;
};

export function FormHeader({ title, description }: FormHeaderProps) {
    return (
        <>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </>
    );
}
