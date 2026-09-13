
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from 'bcryptjs';


export async function POST(req: Request) {
    try {

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\-\.])[A-Za-z\d@$!%*?&#_\-\.]{8,}$/;
        const { token, newPassword } = await req.json();

        if(!token || !newPassword) {
            return NextResponse.json(
                { message: "Token and password are required" },
                { status: 400 }
            );
        }

        if(!strongPasswordRegex.test(newPassword)) {
            return NextResponse.json(
                { message: "The password must be at least 8 characters long, and contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&#)." },
                { status: 400 }
            );
        }

        const resetTokenRecord = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetTokenRecord) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            );
        }

        const isExpired = new Date() > new Date(resetTokenRecord.expires)
        if (isExpired) {
            await prisma.passwordResetToken.delete({
                where: { token },
            });
            return NextResponse.json(
                { message: "Token has expired. Please request a new one." },
                { status: 400 }
            );
        }

        const hashedPass = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { email: resetTokenRecord.email },
            data: {
                hashedPass
            }
        })

        await prisma.passwordResetToken.delete({
            where: { token },
        });

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

    } catch(e) {
        console.error("RESET_PASSWORD_ERROR: (in reset route): ", e);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
