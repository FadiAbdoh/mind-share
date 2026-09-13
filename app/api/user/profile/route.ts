
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prismadb';
import bcrypt from "bcryptjs";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if(!session?.user?.email) {
            return NextResponse.json({ error: "Your not Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },

        });

        if(!user) {
            return NextResponse.json({ error: "User not found" }, {status: 404})
        }

        return NextResponse.json(user, {status: 200});
    } catch(e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.email) {
            return NextResponse.json({ error: "Your not Unauthorized" }, { status: 401 });
        }

        const { name, image, bio, currentPassword, newPassword } = await request.json();

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateData: {
            name?: string;
            image?: string;
            bio?: string;
            hashedPass?: string;
        } = {
            name,
            image,
            bio,
        };

        if (newPassword && newPassword.trim() !== "") {
            if(!currentPassword || currentPassword.trim() === "") {
                return NextResponse.json(
                    { error: "Current password is required to set a new password." },
                    { status: 400 }
                );
            }
            // Google/GitHub
            if (!currentUser.hashedPass) {
                return NextResponse.json(
                    { error: "This account uses OAuth login and does not have a password set." },
                    { status: 400 }
                );
            }

            const isPasswordMatch = await bcrypt.compare(currentPassword, currentUser.hashedPass)

            if (!isPasswordMatch) {
                return NextResponse.json(
                    { error: "Current password does not match our records." },
                    { status: 400 }
                );
            }

            updateData.hashedPass = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
            },
        })
        return NextResponse.json(updatedUser, { status: 200 });

    } catch(e) {
        return NextResponse.json({ error: "Failed to update profilee1111" }, { status: 500 });
    }
}