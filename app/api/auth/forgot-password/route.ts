
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import crypto from 'crypto';
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(requset: Request) {
    try {
        const { email } = await requset.json();

        if(!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            return NextResponse.json(
                { message: "No account found with this email" },
                { status: 404 }
            );
        }

        await prisma.passwordResetToken.deleteMany({
            where: { email },
        });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600 * 1000); //one hour

        await prisma.passwordResetToken.create({
            data: {
                email,
                token: resetToken,
                expires
            }
        });

        await sendPasswordResetEmail(email, resetToken)

        return NextResponse.json(
            { message: "Password reset link generated successfully" },
            { status: 200 }
        );
    } catch(e) {
        console.error("FORGOT_PASSWORD_ERROR: (in forget route): ", e);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}