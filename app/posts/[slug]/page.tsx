
import Image from "next/image"
import Comment from "../../components/comment/Comment";
import prisma from '@/lib/prismadb';
import { notFound } from "next/navigation";
import MenuMP from "@/app/components/sidebar/Sidebar";
import { Calendar, Eye } from "lucide-react";
import { cookies } from "next/headers";
import ViewTracker from "@/app/components/viewTracker/ViewTracker";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

const categoryBgColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

interface SinglePostPageProps {
    params: Promise<{
        slug: string,
    }>
}

export default async function SinglePostPage({ params }: SinglePostPageProps) {

    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            user: { select: { name: true, image: true, id: true } },
            cat: { select: { title: true } },
        },
    })

    if (!post) {
        console.error("post not found in SINGLE_POST_PAGE");
        notFound();
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const badgeBg = categoryBgColors[post.catSlug] || "bg-brand-primary";

    return (
        <div className="px-1 py-4 md:px-4 md:py-8 space-y-12">
            <ViewTracker slug={slug} />

            <header className="flex flex-col-reverse lg:flex-row items-center gap-8">
                <div className="flex-1 space-y-5 w-full">
                    <span
                        className={`${badgeBg} px-4 py-1.5 rounded-full text-white font-semibold text-xs md:text-sm uppercase tracking-wider inline-block`}
                    >
                        {post.catSlug || post.cat.title}
                    </span>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-text-main leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 pt-2"
                    >
                        <div className="relative w-11 h-11 md:w-13 md:h-13 shrink-0">
                            <Link href={`/profile/${post.user.id}`}>
                                <Image
                                    src={post.user.image || '/def-profile-svg.svg'}
                                    alt={post.user?.name || "Author"}
                                    fill
                                    className="rounded-full object-cover border-2 border-brand-primary/20"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col text-xs md:text-sm">
                            <Link href={`/profile/${post.user.id}`}>
                                <span className="font-bold text-text-main capitalize">
                                    {post.user.name || "Unknown Author"}
                                </span>
                            </Link>
                            <div className="flex items-center gap-3 text-text-soft">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formattedDate}
                                </span>
                                <span className="">-</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    {post.views} Views
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {post.mediaUrl && (
                    <div
                        className="flex-1 w-full relative aspect-video lg:aspect-4/3 max-h-[360px] rounded-3xl overflow-hidden shadow-md bg-neutral-100 dark:bg-neutral-800">
                        {post.mediaType === 'video' ? (
                            <video
                                src={post.mediaUrl}
                                controls
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image
                                src={post.mediaUrl}
                                alt={post.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        )}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <main className="lg:col-span-8 space-y-10">
                    <article className="max-w-none text-text-main">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main mt-8 mb-4 tracking-tight">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-xl sm:text-2xl font-bold text-text-main mt-8 mb-3 tracking-tight">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-lg sm:text-xl font-bold text-text-main mt-6 mb-2">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-base sm:text-lg leading-relaxed text-text-soft mb-6 font-normal whitespace-pre-line">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-2 mb-6 text-text-soft text-base sm:text-lg">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside space-y-2 mb-6 text-text-soft text-base sm:text-lg">
                                        {children}
                                    </ol>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-brand-primary pl-4 my-4 italic text-text-soft">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {post.desc}
                        </ReactMarkdown>
                    </article>
                    <Comment />
                </main>
                <aside className="lg:col-span-4 lg:sticky lg:top-20">
                    <MenuMP />
                </aside>
            </div>
        </div>
    )
}


/*

*/