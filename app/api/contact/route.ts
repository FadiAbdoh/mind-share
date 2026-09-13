
import { NextResponse } from "next/server";
import { sendContactMessageEmail } from "@/lib/mail";

export async function POST(req: Request) {

    try {
        const { name, email, subject, message } = await req.json();

        if(!name || !email || !subject) {
            return NextResponse.json(
                { message: "Name, email, and message are required." },
                { status: 400 },
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address." },
                { status: 400 },
            )
        }

        if (message.trim().length < 10) {
            return NextResponse.json(
                { message: "Message must be at least 10 characters long." },
                { status: 400 }
            );
        }

        await sendContactMessageEmail({
            name: name.trim(),
            email: email.trim(),
            subject: subject || "general",
            message: message.trim(),
        });

        return NextResponse.json(
            { message: "Your message has been sent successfully." },
            { status: 200 }
        );

    } catch(e) {
        console.error("CONTACT_API_ERROR:", e);
        return NextResponse.json(
            { message: "Failed to send message. Please try again later." },
            { status: 500 }
        )
    }
}

