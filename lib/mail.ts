
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: `"Mind Share" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                <h2 style="color: #111827; text-align: center; margin-bottom: 16px;">Reset Your Password</h2>
                <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                    You recently requested to reset your password for your account. Click the button below to proceed. This link is valid for <strong>1 hour</strong>.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
                    If the button above doesn't work, copy and paste this link into your browser:
                    <br />
                    <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    If you didn't request a password reset, you can safely ignore this email.
                </p>
            </div>
        `
    })

}

interface ContactEmailParams {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function sendContactMessageEmail({
    name,
    email,
    subject,
    message
}: ContactEmailParams) {
    const subjectMap: Record<string, string> = {
        general: "General Inquiry",
        feedback: "Feedback & Suggestions",
        writer: "Write with Us / Guest Post",
        issue: "Technical Bug / Issue",
        business: "Partnership & Business",
    }

    const formattedSubject = subjectMap[subject] || subject;

    await transporter.sendMail({
        from: `"Mind Share Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `[Mind Share] New message: ${formattedSubject} - from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
                <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px; margin-bottom: 16px;">
                    New Contact Form Submission
                </h2>

                <div style="margin-bottom: 16px;">
                    <p style="margin: 4px 0; color: #6b7280; font-size: 13px;"><strong>Sender Name:</strong></p>
                    <p style="margin: 4px 0; color: #111827; font-size: 15px;">${name}</p>
                </div>

                <div style="margin-bottom: 16px;">
                    <p style="margin: 4px 0; color: #6b7280; font-size: 13px;"><strong>Sender Email:</strong></p>
                    <p style="margin: 4px 0; color: #111827; font-size: 15px;">
                        <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                    </p>
                </div>

                <div style="margin-bottom: 16px;">
                    <p style="margin: 4px 0; color: #6b7280; font-size: 13px;"><strong>Topic:</strong></p>
                    <span style="display: inline-block; padding: 4px 10px; background-color: #f3f4f6; color: #374151; font-size: 13px; font-weight: 600; border-radius: 6px;">
                        ${formattedSubject}
                    </span>
                </div>

                <div style="margin-top: 20px; padding: 16px; background-color: #f9fafb; border-radius: 10px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;"><strong>Message:</strong></p>
                    <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>

                <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
                <p style="color: #9ca3af; font-size: 11px; text-align: center;">
                    You can reply directly to this email to contact the sender.
                </p>

            </div>
        `
    })


}