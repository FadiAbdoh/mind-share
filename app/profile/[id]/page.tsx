"use client"
import { Calendar, Eye, FileText, Grid, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import useSWR from "swr";
import Image from "next/image";
import ProfilePostCard from "@/app/components/ProfilePostCard/ProfilePostCard";

interface AuthorPost {
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

interface AuthorData {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
    bio: string | null;
    createdAt: string;
    posts: AuthorPost[];
}

const fetcher = (url: string) => fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to load author profile");
    return res.json();
})

export default function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);
    const { data: author, isLoading, error } = useSWR<AuthorData>(
        id ? `/api/user/${id}` : null,
        fetcher
    )

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (error || !author) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-text-main">Author Not Found</h2>
                <Link href="/" className="text-sm text-brand-primary hover:underline mt-2 inline-block">
                    Return to home
                </Link>
            </div>
        );
    }

    const postsCount = author.posts?.length || 0;
    console.log(author.email);

    return (
        <div className="py-6 space-y-8 max-w-5xl mx-auto">
            <section className="rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* user img*/}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-md shrink-0 flex items-center justify-center">
                        <Image
                            src={author.image || "/def-profile-svg.svg"}
                            alt={author.name || "Author"}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    
                    {/* personal info*/}
                    <div className="flex-1 text-center sm:text-left space-y-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
                                {author.name || "User Name"}
                            </h1>
                            <p className="text-sm text-text-soft font-medium">
                                @{author.email?.split('@')[0]}
                            </p>
                        </div>

                        <p className="text-sm md:text-base text-text-main leading-relaxed max-w-2xl">
                            {author.bio || "This author hasn't added a bio yet."}
                        </p>

                        <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs md:text-sm text-text-soft">
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" />
                                {author.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Joined{" "}
                                {author.createdAt
                                    ? new Date(author.createdAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : "Recently"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-5 border-t border-gray-200 dark:border-neutral-800 text-center">
                    <span className="text-lg font-bold text-text-main">{postsCount}</span>
                    <span className="text-xs text-text-soft ml-1.5">Published Posts</span>
                </div>
            </section>

            {/* author`s posts*/}
            <section className="space-y-6">
                <div className="flex items-center border-b border-gray-200 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                        <Grid className="w-4 h-4" />
                        <span>Stories by {author.name} ({postsCount})</span>
                    </div>
                </div>

                {postsCount === 0 ? (
                    <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
                        <FileText className="w-8 h-8 mx-auto text-text-soft/40 mb-2" />
                        <p className="text-sm text-text-soft">This author hasn&apos;t published any stories yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {author.posts.map((post) => (
                            <ProfilePostCard canDelete={false} post={post} key={post.id} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );

}