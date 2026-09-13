"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Sparkles,
    BookOpen,
    Users,
    Layers,
    ShieldCheck,
    PenTool,
    ArrowRight,
    Zap
} from "lucide-react";

export default function AboutPage() {

    const values = [
        {
            title: "Open Knowledge",
            description:
                "We believe quality insights, tech tutorials, and real experiences should be accessible to everyone without barriers.",
            icon: BookOpen,
        },
        {
            title: "Author First",
            description:
                "Every writer gets a dedicated profile, simple tools to publish stories, and view analytics to track reader engagement.",
            icon: PenTool,
        },
        {
            title: "Authentic Perspectives",
            description:
                "Real tutorials, technical insights, and thoughts written directly by passionate creators and developers.",
            icon: ShieldCheck,
        },
    ];

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-5xl space-y-16">
            {/* 1. Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-3xl mx-auto space-y-4"
            >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    About Mind Share
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                    Where ideas, tech insights, and shared knowledge converge.
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-neutral-300 leading-relaxed">
                    Mind Share is an open publication space crafted for creators, engineers, and curious readers.
                    Whether it’s software development, lifestyle lessons, coding tutorials, or industry trends—we provide the canvas to share what matters.
                </p>
            </motion.div>

            {/* 2. Core Values */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="space-y-8"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Our Core Principles
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
                        What drives the way we build Mind Share every single day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {values.map((val, idx) => {
                        const Icon = val.icon;
                        return (
                            <div
                                key={idx}
                                className="p-6 rounded-3xl bg-gray-50/70 dark:bg-neutral-900/60 border border-gray-200/80 dark:border-neutral-800 space-y-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                    {val.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                                    {val.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* 3. Call To Action */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-primary/15 via-brand-primary/5 to-transparent border border-brand-primary/20 text-center space-y-6"
            >
                <div className="max-w-xl mx-auto space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        Ready to share your own story?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300">
                        Join other authors on Mind Share and get your perspective in front of thousands of readers.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/writePost"
                        className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                    >
                        <span>Start Writing</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-800 dark:text-neutral-200 font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all border border-gray-200 dark:border-neutral-700 shadow-xs"
                    >
                        Contact Us
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}