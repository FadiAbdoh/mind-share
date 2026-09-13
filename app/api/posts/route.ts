import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
    
    const { searchParams } = new URL(request.url);
    const cat = searchParams.get('cat');
    const userEmail = searchParams.get('userEmail')
    const page = parseInt(searchParams.get('page') || '1');
    // const POST_PER_PAGE = 3;
    const limit = parseInt(searchParams.get('limit') || '3');

    const query = {
        take: limit,
        skip: limit * (page - 1),
        where: {
            ...(cat && { catSlug: cat}),
            ...(userEmail && { userEmail })
        },
        include: {
            user: {
                select: { name: true, image: true, id: true},
            },
            cat: true,
        },
        orderBy: {
            createdAt: "desc" as const,
        }
    };
    
    try {
        const [posts, count] = await prisma.$transaction([
            prisma.post.findMany(query),
            prisma.post.count({where: query.where}),
        ])

        return NextResponse.json({ posts, count }, { status: 200 });
    } catch(e) {
        console.error("Posts Fetch Error:", e);
        return NextResponse.json({ message: 'Error in RETRIVING the POST'}, { status: 500 });
    } 
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email) {
        return NextResponse.json(
            { message: "Unauthorized: Please login first" },
            { status: 401 },
        );
    }

    try {
        const body = await request.json();
        const { title, desc, mediaUrl, mediaType, catSlug } = body;
        if(!title || !desc || !catSlug) {
            return NextResponse.json(
                { message: 'Title, content, and category are required'},
                { status: 400 },
            )
        }

        const baseSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        const slug = `${baseSlug || "post"}-${Date.now()}`;

        const post = await prisma.post.create({
            data: {
                title,
                desc,
                catSlug,
                mediaUrl: mediaUrl || null,
                mediaType: mediaType || null,
                slug,
                userEmail: session.user.email,
            }
        })

        return NextResponse.json(
            post,
            { status: 201 },
        )

    } catch(e) {
        console.error("Post Creation Error:", e);
        return NextResponse.json(
            { message: "Failed to create post" },
            { status: 500 }
        )
    } 
}

export async function DELETE(req: Request) {
    try {

        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email) {
            return NextResponse.json( { message: "Not Authenticated" }, { status: 401 } )
        }

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('id');
        const deleteAll = searchParams.get('all') === 'true';

        if(deleteAll) {
            const userPosts = await prisma.post.findMany({
                where: { userEmail: session.user.email },
                select: { slug: true },
            })

            const slugs = userPosts.map((post) => post.slug).filter(Boolean)

            if(slugs.length > 0) {
                await prisma.comment.deleteMany({
                    where: { postSlug: { in: slugs } },
                }).catch((error) => { console.error("Failed to delete comments:", error) })
            }

            const result = await prisma.post.deleteMany({
                where: { userEmail: session.user.email },
            });

            return NextResponse.json(
                { message: `Successfully deleted ${result.count} posts.` },
                { status: 200 }
            );
        }

        if(!postId) {
            return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if(post.userEmail !== session.user.email) {
            return NextResponse.json(
                { message: "You are not authorized to delete this post" },
                { status: 403 }
            );
        }

        if(post.slug) {
            await prisma.comment.deleteMany({
                where: { postSlug: post.slug },
            }).catch((error) => { console.error("Failed to delete comments:", error) })
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (e) {
        console.error("DELETE_POST_ERROR:", e);
        return NextResponse.json(
            { message: 'Failed to delete post' },
            { status: 500 },
        )
    }
}