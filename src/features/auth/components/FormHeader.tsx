import { CardDescription, CardTitle } from "@/components/ui/card";

type FormHeaderProps = {
    title: string;
    description: string;
};

export function FormHeader({ title, description }: FormHeaderProps) {
    return (
        <>
            <CardTitle className="leading-5.5 text-xl text-center">
                {title}
            </CardTitle>
            <CardDescription className="text-center">
                {description}
            </CardDescription>
        </>
    );
}
