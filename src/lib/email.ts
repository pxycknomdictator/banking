import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ResendProps = {
    to: string | Array<string>;
    subject: string;
    html: string;
};

export async function sendEmail({ to, subject, html }: ResendProps) {
    const from = process.env.RESEND_EMAIL || "";
    try {
        const { error } = await resend.emails.send({ from, to, subject, html });
        if (error) throw new Error(error.message, { cause: error });
    } catch (e) {
        const message = e instanceof Error ? e.message : "failed to send email";
        console.error(message);
    }
}
