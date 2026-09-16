import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json(
            { message: "You must be logged in to comment" },
            { status: 401 }
        );
    }
    const { id } = await params;

    try {

        const comment = await prisma?.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.userEmail !== session.user.email) {
            return NextResponse.json(
                { message: "Forbidden: You can only delete your own comments" },
                { status: 403 }
            );
        }

        await prisma?.comment.deleteMany({
            where: { parentId: id },
        });

        await prisma?.comment.delete({
            where: { id },
        });
        return NextResponse.json(
            { message: "Comment deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { message: "Failed to delete comment" },
            { status: 500 }
        );
    }
}