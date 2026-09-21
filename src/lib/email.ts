import { Resend } from "resend";

type EmailPayload = {
    to: string | Array<string>;
    subject: string;
    html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: EmailPayload) {
    const from = process.env.RESEND_EMAIL || "";
    try {
        const { error } = await resend.emails.send({ from, to, subject, html });
        if (error) throw new Error(error.message, { cause: error });
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        throw new Error(msg);
    }
}
