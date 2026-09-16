"use client";

import { CornerDownRight, Heart, Loader2, MessageCircleMore, Send, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

type CommentWriter = {
    id?: string;
    name: string | null;
    image: string | null;
    email: string;
};

interface CommentType {
    id: string;
    desc: string;
    createdAt: string;
    userEmail: string;
    user: CommentWriter | null;
    likes: string[] | null;
    replies?: CommentType[];
}

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
};

export default function Comment({ postSlug }: { postSlug: string }) {
    const { data: session, status } = useSession();

    const { data: rawComments, mutate, isLoading, error } = useSWR<CommentType[]>(
        `/api/comments?postSlug=${postSlug}`,
        fetcher
    );

    const comments = Array.isArray(rawComments) ? rawComments : [];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        newComment: "",
        replyText: "",
        replyingToId: null as string | null,
    });

    const handleSendComment = async (desc: string, parentId?: string) => {
        if (!desc.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ desc: desc.trim(), postSlug, parentId }),
            });
            if (res.ok) {
                setForm({ newComment: "", replyText: "", replyingToId: null });
                mutate();
            }
        } catch (e) {
            console.error("Cannot write comment", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAction = async (
        url: string,
        method: "DELETE" | "POST",
        optimisticUpdate?: (data: CommentType[] | undefined) => CommentType[]
    ) => {
        try {

            if (optimisticUpdate) {
                mutate(optimisticUpdate, { revalidate: false })
            }

            const res = await fetch(url, { method });

            if (!res.ok) {
                mutate();
            } else if (!optimisticUpdate) {
                mutate();
            }

        } catch (e) {
            console.error("Action failed:", e);
            mutate();
        }
    }

    const onLikeComment = (commentId: string) => {
        if (status !== "authenticated" || !session?.user?.email) {
            alert("Please login to like");
            return;
        }
        const userEmail = session.user.email;
        const toggleLocally = (prev: CommentType[] | undefined): CommentType[] => {
            if(!prev) return [];
            return prev.map((mainComm) => {
                if(mainComm.id === commentId) {
                    const currentLikes = mainComm.likes || [];
                    const hasLiked = currentLikes.includes(userEmail);
                    return {
                        ...mainComm,
                        likes: hasLiked
                            ? currentLikes.filter((e) => e !== userEmail)
                            : [...currentLikes, userEmail]  
                    }
                }
                if(mainComm.replies?.length) {
                    return {
                        ...mainComm,
                        replies: mainComm.replies.map((reply) => {
                            if(reply.id !== commentId) return reply;
                            const currentLikes = reply.likes || [];
                            const hasLiked = currentLikes.includes(userEmail);
                            return {
                                ...reply,
                                likes: hasLiked
                                    ? currentLikes.filter((e) => e !== userEmail)
                                    : [...currentLikes, userEmail]
                            }
                        })
                    }
                }
                return mainComm
            })
        }

        handleAction(`/api/comments/${commentId}/like`, "POST", toggleLocally);
    };

    const renderCommentCard = (commentCard: CommentType, isReply: boolean = false) => {
        const isCommentWriter = session?.user?.email === commentCard.userEmail;
        const isLiked = session?.user?.email ? commentCard.likes?.includes(session.user.email) : false;
        const formattedDate = new Date(commentCard.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
        return (
            <div
                key={commentCard.id}
                className={`p-4 rounded-2xl border space-y-2.5 ${isReply
                    ? "bg-gray-50/40 dark:bg-neutral-900/30 border-gray-100/80 dark:border-neutral-800/80"
                    : "bg-gray-50/70 dark:bg-neutral-900/50 border-gray-100 dark:border-neutral-800"
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className={`relative rounded-full overflow-hidden shrink-0 ${isReply ? "w-7 h-7" : "w-9 h-9"}`}>
                            <Link href={`/profile/${commentCard.user?.id}`}>
                                <Image
                                    src={commentCard.user?.image || "/def-profile-svg.svg"}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </Link>
                        </div>
                        <div>
                            <Link href={`/profile/${commentCard.user?.id}`}>
                                <h4 className="text-xs sm:text-sm font-bold text-text-main hover:underline">
                                    {commentCard.user?.name || 'USER'}
                                </h4>
                            </Link>
                            <span className="text-[10px] text-text-soft">{formattedDate}</span>
                        </div>
                    </div>
                    {isCommentWriter && (
                        <button
                            aria-label="Delete Comment"
                            onClick={() =>
                                confirm("Are you sure you Wanna delete this comment?") &&
                                handleAction(`/api/comments/${commentCard.id}`, "DELETE")
                            }
                            className="text-text-soft hover:text-red-500 p-1 transition-colors cursor-pointer"
                            title="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <p className="text-xs sm:text-sm text-text-main leading-relaxed whitespace-pre-line" dir="auto">
                    {commentCard.desc}
                </p>

                <div className="flex items-center gap-4 text-xs text-text-soft">
                    <button
                        aria-label="Like a Comment"
                        onClick={() => onLikeComment(commentCard.id)}
                        className={`flex items-center gap-1 cursor-pointer transition-colors ${isLiked ? "text-red-500 font-semibold" : "hover:text-text-main"
                            }`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-500" : ""}`} />
                        <span>{commentCard.likes?.length || 0}</span>
                    </button>

                    {!isReply && status === "authenticated" && (
                        <button
                            aria-label="Reply Comment"
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    replyingToId: prev.replyingToId === commentCard.id ? null : commentCard.id,
                                    replyText: "",
                                }))
                            }
                            className="flex items-center gap-1 hover:text-brand-primary cursor-pointer transition-colors"
                        >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>Reply</span>
                        </button>
                    )}
                </div>

                {!isReply && form.replyingToId === commentCard.id && (
                    <div className="pt-2 border-t border-gray-200/50 dark:border-neutral-800 space-y-2">
                        <textarea
                            rows={2}
                            value={form.replyText}
                            onChange={(e) => setForm((prev) => ({ ...prev, replyText: e.target.value }))}
                            placeholder={`Reply to ${commentCard.user?.name || "User"} ...`}
                            dir="auto"
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                aria-label="Cancel Reply"
                                onClick={() => setForm((prev) => ({ ...prev, replyingToId: null }))}
                                className="px-3 py-1 text-xs text-text-soft cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                aria-label="Reply a Comment"
                                onClick={() => handleSendComment(form.replyText, commentCard.id)}
                                disabled={isSubmitting || !form.replyText.trim()}
                                className="px-3 py-1 bg-brand-primary text-white text-xs rounded-lg disabled:opacity-50 cursor-pointer"
                            >
                                Post Reply
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <MessageCircleMore className="w-5 h-5 text-brand-primary" />
                <span>
                    Comments ({comments.reduce((prev, curr) => prev + 1 + (curr.replies?.length || 0), 0)})
                </span>
            </h2>

            {status === "authenticated" ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendComment(form.newComment);
                    }}
                    className="space-y-3"
                >
                    <textarea
                        rows={3}
                        value={form.newComment}
                        onChange={(e) => setForm((prev) => ({ ...prev, newComment: e.target.value }))}
                        placeholder="Write a thoughtful response..."
                        dir="auto"
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-text-main text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
                    />
                    <div className="flex justify-end">
                        <button
                            aria-label="Publish a comment"
                            type="submit"
                            disabled={isSubmitting || !form.newComment.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium text-xs sm:text-sm rounded-xl disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span>Post Comment</span>
                        </button>
                    </div>
                </form>
            ) : (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-neutral-900/50 text-center text-sm text-text-soft">
                    Please{" "}
                    <Link href="/login" className="text-brand-primary font-semibold hover:underline">
                        Log in
                    </Link>{" "}
                    to leave a comment.
                </div>
            )}

            {/* عرض التعليقات أو حالة التحميل */}
            {isLoading ? (
                <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                </div>
            ) : error ? (
                <p className="text-sm text-red-500 text-center py-4">
                    Failed to load comments. Please try again.
                </p>
            ) : comments.length === 0 ? (
                <p className="text-sm text-text-soft text-center py-4">
                    No comments yet. Be the first to start the conversation!
                </p>
            ) : (
                <div className="space-y-5">
                    {comments.map((comment) => (
                        <div key={comment.id} className="space-y-2.5">
                            {renderCommentCard(comment)}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-6 sm:ml-10 space-y-2 border-l-2 border-gray-200/60 dark:border-neutral-800 pl-3 sm:pl-4">
                                    {comment.replies.map((reply) => renderCommentCard(reply, true))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}