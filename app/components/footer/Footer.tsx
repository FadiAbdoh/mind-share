"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    FaFacebookF,
    FaInstagram,
    FaTiktok,
    FaXTwitter,
    FaYoutube,
} from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Sparkles, Heart } from "lucide-react";

interface CategoryType {
    id: string;
    title: string;
    slug: string;
}

const categoryColors: Record<string, string> = {
    coding: "hover:border-blue-500 hover:text-blue-400 hover:shadow-blue-500/20",
    fashion: "hover:border-pink-500 hover:text-pink-400 hover:shadow-pink-500/20",
    food: "hover:border-amber-500 hover:text-amber-400 hover:shadow-amber-500/20",
    travel: "hover:border-emerald-500 hover:text-emerald-400 hover:shadow-emerald-500/20",
    culture: "hover:border-orange-500 hover:text-orange-400 hover:shadow-orange-500/20",
    style: "hover:border-purple-500 hover:text-purple-400 hover:shadow-purple-500/20",
};

export default function Footer() {
    const { status } = useSession();
    const [categories, setCategories] = useState<CategoryType[]>([]);

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories in footer:", err));
    }, []);


    const socialLinks = [
        {
            name: "Facebook",
            icon: <FaFacebookF size={17} />,
            url: "https://facebook.com",
            hoverClass: "hover:bg-[#1877F2]/15 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:shadow-[0_0_15px_rgba(24,119,242,0.35)]",
        },
        {
            name: "Instagram",
            icon: <FaInstagram size={18} />,
            url: "https://instagram.com",
            hoverClass: "hover:bg-pink-500/15 hover:text-pink-400 hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(236,72,153,0.35)]",
        },
        {
            name: "YouTube",
            icon: <FaYoutube size={18} />,
            url: "https://youtube.com",
            hoverClass: "hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.35)]",
        },
        {
            name: "TikTok",
            icon: <FaTiktok size={17} />,
            url: "https://tiktok.com",
            hoverClass: "hover:bg-cyan-500/15 hover:text-cyan-400 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]",
        },
        {
            name: "X",
            icon: <FaXTwitter size={17} />,
            url: "https://x.com",
            hoverClass: "hover:bg-black hover:text-white hover:border-white/40 dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]",
        },
    ];

    return (
        <footer className="relative mt-20 w-full overflow-hidden border-t border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#0c0a10] backdrop-blur-2xl transition-colors duration-300">
            
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-36 bg-gradient-to-r from-brand-primary/25 via-purple-500/20 to-pink-500/25 blur-3xl opacity-60 dark:opacity-40" />

            <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-8 flex flex-col items-center gap-10">
                
                <div className="flex flex-col items-center text-center space-y-3">
                    <Link href="/" aria-label="logo" className="group relative flex items-center gap-2">
                        <motion.span
                            className="relative text-2xl md:text-3xl font-black italic tracking-widest bg-gradient-to-r from-brand-primary via-indigo-500 to-pink-500 bg-clip-text text-transparent select-none inline-block"
                            animate={{
                                filter: [
                                    "drop-shadow(0 0 4px rgba(99,102,241,0.2))",
                                    "drop-shadow(0 0 16px rgba(99,102,241,0.75))",
                                    "drop-shadow(0 0 4px rgba(99,102,241,0.2))",
                                ],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            MIND SHARE
                        </motion.span>
                        <Sparkles className="w-4 h-4 text-brand-primary animate-spin-slow opacity-80" />
                    </Link>
                    <p className="text-xs sm:text-sm text-text-soft max-w-md">
                        Discover cutting-edge stories, technology, and insights from creators around the globe.
                    </p>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 py-2 text-center md:text-left">
                    
                    <div className="flex flex-col items-center md:items-start space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-main/90 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                            Explore Topics
                        </span>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {categories.map((cat) => {
                                const borderHover =
                                    categoryColors[cat.slug] ||
                                    "hover:border-brand-primary hover:text-brand-primary hover:shadow-brand-primary/20";

                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/blog?cat=${cat.slug}`}
                                        className={`px-3 py-1 text-xs font-medium rounded-xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/[0.04] text-text-soft hover:bg-white dark:hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm ${borderHover}`}
                                    >
                                        #{cat.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-main/90">
                            Quick Navigation
                        </span>
                        <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2 text-xs sm:text-sm text-text-soft font-medium">
                            <Link href="/" className="hover:text-brand-primary transition-colors">
                                Home
                            </Link>
                            <Link href="/blog" className="hover:text-brand-primary transition-colors">
                                Articles
                            </Link>
                            <Link href="/about" className="hover:text-brand-primary transition-colors">
                                About
                            </Link>
                            <Link href="/contact" className="hover:text-brand-primary transition-colors">
                                Contact
                            </Link>
                            {status === "authenticated" && (
                                <>
                                    <Link href="/profile" className="hover:text-brand-primary transition-colors">
                                        Profile
                                    </Link>
                                    <Link href="/writePost" className="hover:text-brand-primary transition-colors">
                                        Write Story
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {socialLinks.map((item) => (
                        <motion.a
                            key={item.name}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.name}
                            whileHover={{ scale: 1.15, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-text-soft transition-all duration-300 ${item.hoverClass}`}
                        >
                            {item.icon}
                        </motion.a>
                    ))}
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

                <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs text-text-soft gap-2">
                    <div className="flex items-center gap-1">
                        <span>© 2026</span>
                        <Link
                            href="/"
                            className="font-bold text-text-main hover:text-brand-primary transition-colors"
                        >
                            MIND SHARE
                        </Link>
                        <span>. All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-75">
                        <span>Crafted with</span>
                        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
                        <span>for curious minds.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}