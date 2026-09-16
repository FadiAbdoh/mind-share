import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json(
            { message: "Please log in to like this comment" },
            { status: 401 }
        );
    }

    const { id } = await params;
    const userWhoLike = session.user.email;

    try {

        const comment = await prisma?.comment.findUnique({
            where: { id },
            select: { id: true, likes: true },
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        const hasLiked = comment.likes.includes(userWhoLike);

        const updateComment = await prisma?.comment.update({
            where: { id },
            data: {
                likes: hasLiked
                ? { set: comment.likes.filter((email) => email !== userWhoLike)}
                : { push: userWhoLike}
            },
            select: { likes: true },
        })

        return NextResponse.json(
            {
                likesCount: updateComment?.likes.length,
                hasLiked: !hasLiked
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json(
            { message: "Failed to update like status" },
            { status: 500 }
        );
    }
}