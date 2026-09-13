
import { Eye, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostItem {
    id: string;
    slug: string;
    title: string;
    desc: string;
    mediaUrl: string | null;
    mediaType: string | null;
    catSlug: string;
    cat?: { title: string };
    views: number;
    createdAt: string;
}

type PageType = {
    post: PostItem,
    onDelete?: () => void,
    canDelete: boolean
}

const categoryColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

export default function ProfilePostCard({ post, onDelete, canDelete }: PageType) {

    const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const badgeColor = categoryColors[post.catSlug] || "bg-brand-primary";

    return (
        <div
            className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-gray-50/60 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all duration-300"
        >
            {canDelete && (
                <button
                    onClick={onDelete}
                    title="Delete Post"
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/90 dark:bg-neutral-800/90 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-200/80 dark:border-neutral-700 shadow-xs transition-colors cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            {/* media */}
            <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                {post.mediaUrl ? (
                    post.mediaType === "video" ? (
                        <video src={post.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                        <Image
                            src={post.mediaUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-soft/40">
                        <FileText className="w-8 h-8" />
                    </div>
                )}
            </div>
            {/* details */}
            <div className="flex flex-col justify-between space-y-2 py-1 flex-1 pr-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span
                            className={`${badgeColor} text-white font-medium text-xs px-2.5 py-0.5 rounded-md capitalize inline-block`}
                        >
                            {post.cat?.title || post.catSlug}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-soft">
                            <Eye className="w-3.5 h-3.5" />
                            {post.views}
                        </span>
                    </div>

                    <Link href={`/posts/${post.slug}`}>
                        <h2 className="font-bold text-base text-text-main group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                            {post.title}
                        </h2>
                    </Link>
                </div>

                <span className="text-xs text-text-soft">{formattedDate}</span>
            </div>
        </div>
    )
}