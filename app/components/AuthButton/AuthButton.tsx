"use client";

import { useUser } from "@/app/context/UserContext";
import { motion } from "framer-motion";
import { LogIn, LogOut, UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// إنشاء مكون Link يحمل خصائص Framer Motion
const MotionLink = motion(Link);
const MotionButton = motion.button;

export default function AuthButton() {

    const { status } = useSession();
    const { userInfo, loading } = useUser();

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
                <div className="w-20 h-9 rounded-xl bg-black/10 dark:bg-white/10 animate-pulse hidden sm:block" />
            </div>
        );
    }

    if (status === 'authenticated') {
        return (
            <div className="flex items-center gap-3 w-full">
                {/* profile img*/}
                <Link
                    href="/profile"
                    className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] bg-gradient-to-tr from-brand-primary via-purple-500 to-pink-500 shrink-0 transition-transform duration-300 hover:scale-105"
                >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-neutral-950">
                        <Image
                            src={userInfo?.image || "/def-profile-svg.svg"}
                            alt={userInfo?.name || "User Avatar"}
                            fill
                            priority
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                </Link>

                {/* logout */}
                <MotionButton
                    onClick={() => signOut({ callbackUrl: "/" })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative overflow-hidden inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 dark:border-red-500/30 transition-all duration-200 cursor-pointer select-none"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                </MotionButton>
            </div>
        );
    }

    return (
        <MotionLink
            href="/login"
            whileHover={{
                scale: 1.03,
                boxShadow: "0 0 20px rgba(99, 102, 241, 0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className="flex-1 relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-brand-primary via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md cursor-pointer select-none"
        >
            {/* (Shine effect) */}
            <motion.div
                className="absolute inset-0 w-[40px] h-full bg-white/30 blur-[4px] -skew-x-[25deg] pointer-events-none"
                initial={{ left: "-100%" }}
                animate={{ left: "150%" }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 2.5,
                    ease: "linear",
                    repeatDelay: 1.5,
                }}
            />
            <LogIn className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Login</span>
        </MotionLink>
    );
}