"use client"

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import React from 'react'


export default function HeroHeader() {
    return (
        <div className="relative py-4 text-center overflow-hidden">
            {/* 🟢 توهج خلفي ناعم (Glow Background) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-24 bg-brand-primary/20 blur-3xl rounded-full pointer-events-none -z-10" />

            {/* 🟢 شارة علوية ترحيبية صغيرة بحركة ارتداد */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-4 backdrop-blur-md shadow-xs"
            >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
                <span>Welcome to Mind Share</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text-main leading-tight"
            >
                Where Great Ideas{" "}
                <span className="bg-linear-to-r from-brand-primary via-purple-500 to-rose-500 bg-clip-text text-transparent underline decoration-wavy decoration-brand-primary/30 decoration-2">
                    Come Alive.
                </span>
            </motion.h1>

            {/* 🟢 نص فرعي مقتضب ومباشر */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-text-soft text-sm sm:text-base max-w-md mx-auto mt-3 font-medium"
            >
                Explore top stories, insights & perspectives that spark curiosity.
            </motion.p>
        </div>
    )
}