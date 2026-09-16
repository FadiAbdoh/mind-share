"use client";

import { CornerDownRight, Heart, Loader, Loader2, MessageCircleMore, Send, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CommentWriter = {
    name: string | null,
    image: string | null,
    email: string
}

interface CommentType {
    id: string;
    desc: string;
    createdAt: string;
    userEmail: string;
    user: CommentWriter | null;
    likes: string[] | null;
    replies?: CommentType[];
}

export default function Comment({ postSlug }: { postSlug: string }) {

    const { data: session, status } = useSession();

    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState({ list: true, submit: false });
    const [form, setForm] = useState({
        newComment: '',
        replyText: '',
        replyingToId: null as string | null,
    })

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?postSlug=${postSlug}`)
            if (!res.ok) console.log('Error fetching comments')
            setComments(await res.json())
        } finally {
            setLoading((prev) => ({ ...prev, list: false }));
        }
    }, [postSlug])

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSendComment = async (desc: string, parentId?: string) => {
        if (!desc.trim()) return;
        setLoading((prev) => ({ ...prev, submit: true }));

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ desc: desc.trim(), postSlug, parentId })
            })
            if (res.ok) {
                setForm({ newComment: "", replyText: "", replyingToId: null });
                fetchComments();
            }
        } catch (e) {
            console.error('Can not write comment', e)
        } finally {
            setLoading((prev) => ({ ...prev, submit: false }))
        }
    }
    // delete comment, like comment
    const handleAction = async (url: string, method: "DELETE" | "POST") => {
        const res = await fetch(url, { method })
        if (res.ok) fetchComments();
    }

    const renderCommentCard = (commentCard: CommentType, isReply: boolean = false) => {
        // comment owner
        const isCommentWritter = session?.user?.email === commentCard.userEmail;
        const isLiked = session?.user?.email ? commentCard.likes?.includes(session.user.email) : false;
        const formattedDate = new Date(commentCard.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })

        return (
            <div
                key={commentCard.id}
                className={`p-4 rounded-2xl border space-y-2.5 ${isReply
                    ? 'bg-gray-50/40 dark:bg-neutral-900/30 border-gray-100/80 dark:border-neutral-800/80'
                    : 'bg-gray-50/70 dark:bg-neutral-900/50 border-gray-100 dark:border-neutral-800'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className={`relative rounded-full overflow-hidden shrink-0 ${isReply ? "w-7 h-7" : "w-9 h-9"}`}>
                            <Link href='/'>
                                <Image
                                    src={commentCard.user?.image || "/def-profile-svg.svg"}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </Link>
                        </div>
                        <div>
                            <Link href='/'>
                                <h4 className="text-xs sm:text-sm font-bold text-text-main">
                                    {commentCard.user?.name || "User"}
                                </h4>
                            </Link>
                            <span className="text-[10px] text-text-soft">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                    {isCommentWritter && (
                        <button
                            onClick={() =>
                                confirm("Wanna delete comment ?") &&
                                handleAction(`/api/comments/${commentCard.id}`, 'DELETE')
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
                        onClick={() =>
                            status === 'authenticated'
                                ? handleAction(`/api/comments/${commentCard.id}/like`, 'POST')
                                : alert("Please login to like")
                        }
                        className={`flex items-center gap-1 cursor-pointer transition-colors ${isLiked
                            ? 'text-red-500 font-semibold'
                            : 'hover:text-text-main'
                            }`}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-500" : ""}`} />
                        <span>{commentCard.likes?.length || 0}</span>
                    </button>
                    {!isReply && status === 'authenticated' && (
                        <button
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    replyingToId:
                                        prev.replyingToId === commentCard.id
                                            ? null
                                            : commentCard.id,
                                    replyText: ''
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
                            placeholder={`Reply to ${commentCard.user?.name} ...`}
                            dir="auto"
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-text-main text-xs focus:ring-1 focus:ring-brand-primary focus:outline-none resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={(e) => setForm((prev) => ({...prev, replyingToId: null}))}
                                className="px-3 py-1 text-xs text-text-soft cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSendComment(form.replyText, commentCard.id)}
                                disabled={loading.submit && !form.replyText.trim()}
                                className="px-3 py-1 bg-brand-primary text-white text-xs rounded-lg disabled:opacity-50 cursor-pointer"
                            >
                                Post Reply
                            </button>
                        </div>
                    </div>
                )}

            </div>
        )
    }

    return (
        <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                <MessageCircleMore className="w-5 h-5 text-brand-primary" />
                <span>
                    Comments ({comments.reduce((prev, curr) => prev + 1 + (curr.replies?.length || 0), 0)})
                </span>
            </h2>
            {/* form */}
            {status === 'authenticated' ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendComment(form.newComment)
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
                            type="submit"
                            disabled={loading.submit || !form.newComment.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium text-xs sm:text-sm rounded-xl disabled:opacity-50 cursor-pointer"
                        >
                            {loading.submit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
            {/* comments */}
            {loading.list ? (
                <div className="flex justify-center py-6">
                    <Loader className="w-6 h-6 animate-spin text-brand-primary" />
                </div>
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
                                <div
                                    className="ml-6 sm:ml-10 space-y-2 border-l-2 border-gray-200/60 dark:border-neutral-800 pl-3 sm:pl-4"
                                >
                                    {comment.replies.map((reply) => renderCommentCard(reply, true))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/*

*/