
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req: Request, { params }: { params: Promise<{id: string}> }) {
    
    try {

        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }


        const author = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                createdAt: true,
                posts: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        cat: true
                    }
                }
            }
        })

        if (!author) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(author, { status: 200 });

    } catch(e) {
        console.error("GET_AUTHOR_PROFILE_ERROR:", e);
        return NextResponse.json(
            { message: "Failed to load author profile" },
            { status: 500 }
        );
    }

}