import { CardTitle, CardDescription } from "@/components/ui/card";

type FormHeaderProps = {
    title: string;
    description: string;
};

export function FormHeader({ title, description }: FormHeaderProps) {
    return (
        <>
            <CardTitle className="font-medium">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </>
    );
}
