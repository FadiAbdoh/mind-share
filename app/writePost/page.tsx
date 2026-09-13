"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, Reorder } from "framer-motion";
import {
    Image as ImageIcon,
    Video,
    X,
    Send,
    Sparkles,
    Tag,
    AlignLeft,
    Loader2,
    FileText,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


interface CategoryType {
    img: string, 
    title: string, 
    id: string, 
    slug: string
}

const categoryColors: Record<string, string> = {
    coding: "bg-brand-coding",
    fashion: "bg-brand-fashion",
    food: "bg-brand-food",
    travel: "bg-brand-travel",
    culture: "bg-brand-culture",
    style: "bg-brand-style",
};

export default function WritePostPage() {
    const { status } = useSession();
    const router = useRouter();

    // State Management
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    // Status State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                    if (data.length > 0) {
                        setSelectedCategory(data[0].slug);
                    }
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, []);


    const handleMediaChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "image" | "video"
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaType(type);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveMedia = () => {
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }
        setMediaFile(null)
        setMediaType(null);
        setMediaPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('');

        if(!title.trim() || !content.trim() || !selectedCategory) {
            setErrorMessage("Please fill in the title, content, and select a category.");
            return;
        }

        setIsSubmitting(true);

        try {
            let mediaUrl: string | null = null;
            
            if(mediaFile) {
                const uploadData = new FormData();
                uploadData.append('file', mediaFile)
                const uploadRes = await fetch('/api/uploadimg',{
                    method: "POST",
                    body: uploadData
                })

                if(!uploadRes.ok) {
                    throw new Error("Failed to upload media");
                }
                const uploadResult = await uploadRes.json();
                mediaUrl = uploadResult.url;
            }

            const postRes = await fetch('/api/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    desc: content,
                    catSlug: selectedCategory,
                    mediaUrl,
                    mediaType: mediaFile ? mediaType : null
                })
            });

            if(!postRes.ok) {
                const error = await postRes.json();
                throw new Error(error.message || "Failed to publish post");
            }

            const post = await postRes.json();
            router.push(`/posts/${post.slug}`)
            router.refresh();
        } catch(e) {
            setErrorMessage("Something went wrong in writePost.");
        } finally {
            setIsSubmitting(false);
        }

    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="mx-auto py-4 md:py-8 space-y-8 max-w-4xl">
            {/* 🟢 Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-neutral-800 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-main flex items-center gap-2">
                        <span>Create New Story</span>
                        <Sparkles className="w-5 h-5 text-brand-primary" />
                    </h1>
                    <p className="text-sm text-text-soft mt-1">
                        Share your thoughts, tutorials, or experiences with the community.
                    </p>
                </div>

                {/* publish btn*/}
                <motion.button
                type="submit"
                form="post-form"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-xl shadow-sm transition-colors text-sm min-h-[44px] cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Publishing...</span>
                        </>
                    ): (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Publish Story</span>
                        </>
                    )}

                </motion.button>
            </div>
            
            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                    {errorMessage}
                </div>
            )}

            <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
                {/* 🟢 اختيار التصنيف (Category Selector) */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-soft uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Select Category</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer min-h-[38px] ${
                                selectedCategory === cat.slug
                                    ? `${categoryColors[cat.slug]} text-white shadow-sm`
                                    : "bg-gray-100 dark:bg-neutral-800/80 text-text-soft hover:text-text-main"
                                }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                        
                    </div>
                </div>

                {/* 🟢 عنوان المقال (Post Title) */}
                <div className="space-y-2">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        name="title"
                        type="text"
                        required
                        dir="auto"
                        placeholder="Article Title..."
                        className="w-full text-2xl sm:text-4xl font-extrabold bg-transparent text-text-main placeholder:text-text-soft/40 focus:outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-neutral-800 pb-2 transition-colors"
                    />
                </div>

                {/* 🟢 قسم إضافة وسائط (صورة أو فيديو - اختياري) */}
                <div className="space-y-3">
                    {!mediaPreview ? (
                        <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-800/70 hover:bg-gray-200 dark:hover:bg-neutral-800 text-text-main text-xs font-medium cursor-pointer transition-colors min-h-[40px]">
                            <ImageIcon className="w-4 h-4 text-brand-primary" />
                            <span>Add Cover Image</span>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaChange(e, "image")}
                            className="hidden"
                            />
                        </label>

                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-800/70 hover:bg-gray-200 dark:hover:bg-neutral-800 text-text-main text-xs font-medium cursor-pointer transition-colors min-h-[40px]">
                            <Video className="w-4 h-4 text-brand-coding" />
                            <span>Add Video</span>
                            <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleMediaChange(e, "video")}
                            className="hidden"
                            />
                        </label>
                        <span className="text-xs text-text-soft font-medium">
                            (Optional media attachment)
                        </span>
                        </div>
                    ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 bg-neutral-900 group max-h-[420px] flex items-center justify-center">
                        {/* زر الحذف */}
                        <button
                            type="button"
                            onClick={handleRemoveMedia}
                            className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {mediaType === "image" ? (
                            <div className="relative w-full h-80 sm:h-96">
                            <Image
                                src={mediaPreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            </div>
                        ) : (
                            <video
                            src={mediaPreview}
                            controls
                            className="w-full max-h-[400px] object-contain"
                            />
                        )}
                        </div>
                    )}
                </div>

                {/* 🟢 محتوى المقال (Article Body) */}
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-text-soft uppercase tracking-wider pb-1">
                        <AlignLeft className="w-3.5 h-3.5" />
                        <span>Story Content</span>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        name="content"
                        rows={14}
                        required
                        dir="auto"
                        placeholder="Tell your story... (Supports Arabic & English)"
                        className="w-full p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/40 text-text-main text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-y leading-relaxed font-normal placeholder:text-text-soft/40"
                    />
                </div>
            </form>
        </div>
    );
}