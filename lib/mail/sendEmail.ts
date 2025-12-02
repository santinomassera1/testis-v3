import nodemailer from 'nodemailer';

interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        content?: string | Buffer;
        path?: string;
        contentType?: string;
        encoding?: string;
    }>;
}

export async function sendEmail({ to, subject, text, html, attachments }: SendEmailOptions) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: user,
            to,
            subject,
            text,
            html,
            attachments,
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
