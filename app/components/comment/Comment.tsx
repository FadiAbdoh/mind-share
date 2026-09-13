"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function Comment() {
    
    // بيانات وهمية للتعليقات
    const initialComments = [
        {
            id: "1",
            user: {
                name: "Alex Johnson",
                image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
            },
            date: "12.02.2025",
            desc: "Great article! The explanation of Next.js 15 App Router is crystal clear. Looking forward to more content like this.",
        },
        {
            id: "2",
            user: {
                name: "Sophia Martinez",
                image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
            },
            date: "11.02.2025",
            desc: "Loved the UI design tips. I implemented the Tailwind structure in my project and it improved my Lighthouse accessibility score dramatically!",
        },
    ];
    
    const [comments, setComments] = useState(initialComments);
    const [desc, setDesc] = useState("");
    // افتراض حالة تسجيل الدخول (غير هذا للربط المباشر مع جلسة المستخدم لاحقاً)
    const status = "authenticated";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!desc.trim()) return;

        const newComment = {
            id: crypto.randomUUID(),
            user: {
                name: "Current User",
                image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
            },
            date: new Date().toLocaleDateString("en-GB"),
            desc: desc,
        };

        setComments([newComment, ...comments]);
        setDesc("");
    };

    return (
        <section aria-labelledby="comments-heading" className="mt-10 space-y-8">
            {/* 🟢 عنوان القسم الرئيسي بعنصر h2 معتمد من Lighthouse */}
            <h2 id="comments-heading" className="text-2xl font-bold text-text-main">
                Comments ({comments.length})
            </h2>
            
            {/* 🟢 نموذج كتابة تعليق (أو رسالة تسجيل الدخول) */}
            {status === "authenticated" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="comment-input" className="sr-only">
                        Write a comment
                    </label>
                    <textarea
                        id="comment-input"
                        rows={3}
                        placeholder="Write a comment..."
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 resize-none text-sm md:text-base"
                    />
                    <div className="flex justify-end">
                        <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-medium px-6 py-2.5 rounded-xl min-h-[44px] cursor-pointer shadow-sm transition-colors duration-200"
                        >
                            <span>Send</span>
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </div>
                </form>
            ) : (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 text-center text-text-soft">
                    <Link
                        href="/login"
                        className="text-brand-primary font-semibold underline underline-offset-4 min-h-[44px] inline-flex items-center px-2"
                    >
                        Log in
                    </Link>{" "}
                    to write a comment.
                </div>
            )}

            {/* 🟢 قائمة التعليقات المكتوبة */}
            <div className="space-y-6">
                {comments.map((item) => (
                <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-gray-50/60 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 space-y-3"
                >
                    {/* رأس التعليق: صورة وصاحب التعليق */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                            src={item.user.image}
                            alt={item.user.name}
                            fill
                            className="rounded-full object-cover border border-gray-200 dark:border-neutral-700"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm text-text-main">
                                {item.user.name}
                            </span>
                            <span className="text-xs text-text-soft">{item.date}</span>
                        </div>
                    </div>

                    {/* نص التعليق */}
                    <p className="text-sm md:text-base text-text-main leading-relaxed">
                        {item.desc}
                    </p>
                </div>
                ))}
            </div>
        </section>
    )
}