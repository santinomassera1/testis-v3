import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail/sendEmail';
import { z } from 'zod';

const sendEmailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    body: z.string().min(1),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = sendEmailSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { to, subject, body: emailBody } = result.data;

        // Convert newlines to <br> for HTML email if needed, or just send as text
        // For now, we'll send both text and a simple HTML version
        const htmlBody = emailBody.replace(/\n/g, '<br>');

        const emailResult = await sendEmail({
            to,
            subject,
            text: emailBody,
            html: htmlBody,
        });

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'Failed to send email', details: emailResult.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, messageId: emailResult.messageId });
    } catch (error) {
        console.error('Error in send-email route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
