import nodemailer, { type Transporter } from "nodemailer";

interface Email {
    to: string;
    subject: string;
    text: string;
    html: string;
}

let transporter: Transporter | null = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === "true", // true for port 465, false for STARTTLS (587)
            auth: process.env.SMTP_USER
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
                : undefined,
        });
    }
    return transporter;
}

export async function sendEmail(email: Email) {
    // Without SMTP (local development) the email is printed to the server console instead
    if (!process.env.SMTP_HOST) {
        console.log(`[email] SMTP_HOST is not set, email to ${email.to} not sent.`);
        // Links get their own log lines: some terminals garble long output that contains non-ASCII text
        for (const link of email.text.match(/https?:\/\/\S+/g) ?? []) {
            console.log(`[email] link: ${link}`);
        }
        console.log(`[email] content:\nSubject: ${email.subject}\n\n${email.text}`);
        return;
    }

    await getTransporter().sendMail({
        from: process.env.SMTP_FROM,
        ...email,
    });
}
