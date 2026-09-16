
import Prisma from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
        return NextResponse.json(
            { message: 'postSlug is required' },
            { status: 400 }
        )
    }

    try {
        const comments = await prisma?.comment.findMany({
            where: {
                postSlug,
                parentId: null,
            },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                },
                replies: {
                    include: {
                        user: {
                            select: { name: true, image: true, email: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' },
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(comments, { status: 200 })
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { message: 'Failed to load comments' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json(
            { message: "You must be logged in to comment" },
            { status: 401 }
        );
    }

    try {

        const body = await req.json();
        const { desc, postSlug, parentId } = body;

        if (!desc || !desc.trim() || !postSlug) {
            return NextResponse.json(
                { message: "Comment text and postSlug are required" },
                { status: 400 }
            );
        }

        const newComment = await prisma?.comment.create({
            data: {
                desc: desc.trim(),
                postSlug,
                userEmail: session.user.email,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: { name: true, image: true, email: true }
                }
            }
        })
        return NextResponse.json(newComment, { status: 201 })
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "Failed to publish comment" },
            { status: 500 }
        );
    }
}