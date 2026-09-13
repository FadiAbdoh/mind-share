
import { cookies } from "next/headers";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
        req: Request,
        { params }: { params: Promise<{ slug: string }> }
    ) {

        const { slug } = await params;
        const cookieStore = await cookies();
        const viewedCookieKey = `viewed_post_${slug}`;
        const hasViewd = cookieStore.get(viewedCookieKey);

        if(!hasViewd) {
            await prisma.post.update({
                where: { slug },
                data: { views: { increment: 1 } },
            })

            cookieStore.set(viewedCookieKey, "true", {
                maxAge: 60 * 60 * 24,
                path: '/',
                httpOnly: true,
            })

            return NextResponse.json({ message: "View recorded" }, { status: 200 })
        }

        return NextResponse.json({ message: "Already viewed" }, { status: 200 });
    }