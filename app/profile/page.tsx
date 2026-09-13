"use client";

import { useState } from "react";
import { Grid, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import useSWR from "swr";
import ProfileHeader from "../components/profileHeader/profileHeader";
import EmptyPostsProfile from "../components/EmptyPostsProfile/EmptyPostsProfile";
import ProfilePostCard from "../components/ProfilePostCard/ProfilePostCard";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal/DeleteConfirmationModal";

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

type DeleteModal = {
    isOpen: boolean;
    isDeleteAll: boolean;
    postId: string | null;
    postTitle: string | null;
}

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts in profile");
        return res.json();
    })

export default function ProfilePage() {
    const router = useRouter();
    const { userInfo, loading } = useUser();

    const POSTS_PER_PAGE = 6;
    const [visibleCount, setVisibleCount] = useState<number>(POSTS_PER_PAGE);

    // delete modal
    const [deleteModal, setDeleteModal] = useState<DeleteModal>({
        isOpen: false,
        isDeleteAll: false,
        postId: null,
        postTitle: null
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    //

    const { data: postsData, isLoading: postsLoading, isValidating, mutate } = 
    useSWR<{ posts: PostItem[], count: number }>(
        userInfo?.email ? `/api/posts?userEmail=${encodeURIComponent(userInfo.email)}&limit=${visibleCount}` : null,
        fetcher
    )

    const posts = postsData?.posts || [];
    const postsCount = postsData?.count || 0;
    const hasMore = posts.length < postsCount;

    //Deleting Functions
    const handleOpenDeleteAll = () => {
        setFeedback(null);
        setDeleteModal({ isOpen: true, isDeleteAll: true, postId: null, postTitle: null});
    }

    const handleOpenDeleteSingle = (id: string, title: string) => {
        setFeedback(null);
        setDeleteModal({ isOpen: true, isDeleteAll: false, postId: id, postTitle: title})
    }

    const handleCloseModal = () => {
        if(isDeleting) return;
        setDeleteModal({ isOpen: false, isDeleteAll: false, postId: null, postTitle: null });
        setFeedback(null);
    }

    const handleConfirmDelete = async () => {
        setFeedback(null);
        setIsDeleting(true);

        try {
            
            const endPoint = deleteModal.isDeleteAll 
            ? '/api/posts?all=true'
            : `/api/posts?id=${deleteModal.postId}`

            const res = await fetch(endPoint, { method: "DELETE"});
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to delete.");

            setFeedback({
                type: "success",
                message: deleteModal.isDeleteAll 
                ? "All your posts have been permanently deleted." 
                : "Post has been successfully deleted."
            });

            await mutate();

            setTimeout(() => {
                handleCloseModal();
            }, 1000)

        } catch(e: any) {
            setFeedback({
                type: "error",
                message: e.message || 'Something went wrong. Please try again.(profile.tsx)',
            })
        } finally {
            setIsDeleting(false);
        }
    }


    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!userInfo) {
        router.push("/login");
        return null;
    }

    return (
        <div className="py-6 space-y-8 max-w-5xl mx-auto">
            {/* (Profile Header) */}
            <ProfileHeader userInfo={userInfo} postsCount={postsCount} />

            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                        <Grid className="w-4 h-4" />
                        <span>My Posts ({postsCount})</span>
                    </div>

                    {postsCount > 0 && (
                        <button
                            onClick={handleOpenDeleteAll}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60 border border-red-200/80 dark:border-red-900/40 rounded-xl transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete All Posts</span>
                        </button>
                    )}
                </div>

                {/* posts list*/}
                {postsLoading ? (
                    <div className="py-12 flex justify-center items-center">
                        <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
                    </div>
                ) : postsCount === 0 ? (
                    <EmptyPostsProfile />
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map((post) => (
                                <ProfilePostCard 
                                key={post.id}
                                canDelete={true}
                                post={post}
                                onDelete={() => handleOpenDeleteSingle(post.id, post.title)}
                                />
                            ))}
                        </div>
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <button
                                    disabled={isValidating}
                                    onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-text-main text-xs sm:text-sm font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isValidating && <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />}
                                    <span>
                                        {isValidating ? "Loading stories..." : `Load More Stories (${postsCount - posts.length} remaining)`}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )
                }
            </section>

            <DeleteConfirmationModal 
            isOpen={deleteModal.isOpen}
            isDeleteAll={deleteModal.isDeleteAll}
            postTitle={deleteModal.postTitle}
            isDeleting={isDeleting}
            feedback={feedback}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

