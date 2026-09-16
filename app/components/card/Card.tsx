
import { ArrowRight } from "lucide-react";
import Image from "next/image"
import Link from "next/link"

interface PostCardProps {
    post: {
        id: string,
        slug: string,
        title: string,
        desc: string,
        mediaUrl?: string | null;
        mediaType?: string | null;
        createdAt: string | Date;
        catSlug: string;
        cat?: { title: string };
        user?: {
            id?: string,
            name?: string | null,
            image?: string | null,
        }
    }
}

const categoryColors: Record<string, string> = {
    coding: "text-brand-coding",
    fashion: "text-brand-fashion",
    food: "text-brand-food",
    travel: "text-brand-travel",
    culture: "text-brand-culture",
    style: "text-brand-style",
};

export default function Card({ post }: PostCardProps) {

    const formattedDate = new Date(post.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="flex flex-col md:flex-row gap-5">
            {/* media if exists */}
            {post.mediaUrl && (
                <div className="relative w-full h-[200px] md:flex-1 md:h-[250px]">
                    {post.mediaType === 'video' ? (
                        <video
                            src={post.mediaUrl}
                            muted
                            playsInline
                            controls
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={post.mediaUrl}
                            alt={post.title}
                            fill
                            className="object-cover rounded-md" />
                    )}
                </div>
            )}

            <div className="flex-2 flex flex-col gap-2">

                <div className="flex items-center justify-between gap-2">
                    {post.user && (
                        <Link
                            href={post.user.id ? `/profile/${post.user.id}` : "#"}
                            className="flex items-center gap-2 group/author w-fit"
                        >
                            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200 dark:border-neutral-700 shrink-0">
                                <Image
                                    src={post.user.image || "/def-profile-svg.svg"}
                                    alt={post.user.name || "Author"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xs font-semibold text-text-main group-hover/author:text-brand-primary transition-colors line-clamp-1">
                                {post.user.name || "Anonymous"}
                            </span>
                        </Link>
                    )}

                    <div className="text-xs text-text-soft flex items-center gap-1.5 shrink-0">
                        <span>{formattedDate}</span>
                        <span>•</span>
                        <span
                            className={`uppercase ${categoryColors[post.catSlug] || "text-brand-primary"
                                } font-semibold`}
                        >
                            {post.cat?.title || post.catSlug}
                        </span>
                    </div>
                </div>
                {/* posst title */}
                <Link href={`/posts/${post.slug}`}>
                    <h1 className='text-base font-semibold'>
                        {post.title}
                    </h1>
                </Link>

                <p className='text-sm text-text-soft line-clamp-3 leading-relaxed'>
                    {post.desc}
                </p>
                <div className="pt-2">
                    <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium text-sm rounded-xl transition-all shadow-xs"
                    >
                        <span>Read Story</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}