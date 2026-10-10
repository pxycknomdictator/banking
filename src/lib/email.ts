import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailOptions = {
    to: string | Array<string>;
    subject: string;
    html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
    try {
        const from = process.env.RESEND_EMAIL || "Acme <onboarding@resend.dev>";
        const { error } = await resend.emails.send({ from, to, subject, html });
        if (error) throw new Error("failed to send email");
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        throw new Error(msg, { cause: err });
    }
}
