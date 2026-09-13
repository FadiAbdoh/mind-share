"use client";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import AuthButton from "../AuthButton/AuthButton";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { status } = useSession();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Contact", href: "/contact" },
        { name: "About", href: "/about" },
        ...(status === "authenticated"
            ? [
                { name: "Profile", href: "/profile" },
                { name: "Write Post", href: "/writePost" },
            ]
            : []),
    ];

    return (
        <nav
            ref={menuRef}
            className="sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-xl bg-white/75 dark:bg-[#0f0e13]/80 border-b border-black/5 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
        >
            <div className="max-w-7xl mx-auto px-2 md:px-4 sm:px-8 py-3 flex items-center justify-between">
                <Link href="/" aria-label="logo" className="group relative flex items-center gap-1.5">
                    <motion.div
                        className="relative font-black tracking-widest text-base lg:text-2xl italic select-none"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="absolute -inset-1 blur-lg opacity-40 group-hover:opacity-100 bg-gradient-to-r from-brand-primary via-indigo-500 to-pink-500 transition-opacity duration-500 rounded-lg -z-10" />

                        <motion.span
                            className="inline-block bg-gradient-to-r from-brand-primary via-indigo-500 to-pink-500 bg-clip-text text-transparent"
                            animate={{
                                filter: [
                                    "drop-shadow(0 0 3px rgba(99,102,241,0.25))",
                                    "drop-shadow(0 0 14px rgba(99,102,241,0.75))",
                                    "drop-shadow(0 0 3px rgba(99,102,241,0.25))",
                                ],
                            }}
                            transition={{
                                duration: 3.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            MIND SHARE
                        </motion.span>
                    </motion.div>
                    <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse opacity-70 group-hover:rotate-45 transition-transform" />
                </Link>

                <div className="flex items-center gap-3 md:gap-4">
                    <ThemeToggle />

                    <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-3.5 py-1.5 rounded-full text-sm font-semibold text-text-main/80 hover:text-text-main transition-colors group overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-brand-primary/10 dark:bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200 -z-10" />
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}

                        <div className="pl-3 border-l border-black/10 dark:border-white/10">
                            <AuthButton />
                        </div>
                    </div>

                    <div className="flex md:hidden items-center">
                        <IconButton
                            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-current !p-2"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CloseIcon className="text-2xl text-brand-primary" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <MenuIcon className="text-2xl text-brand-primary" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </IconButton>
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden absolute top-full left-0 w-full backdrop-blur-2xl bg-white/95 dark:bg-[#121118]/95 border-b border-black/10 dark:border-white/15 shadow-2xl flex flex-col p-6 gap-2 md:hidden z-50"
                        >
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 + 0.08, duration: 0.25 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between py-3 px-4 rounded-xl text-base font-bold text-text-main/90 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                                    >
                                        <span>{link.name}</span>
                                        <span className="text-xs text-brand-primary opacity-60">→</span>
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.25, duration: 0.25 }}
                                className=" pt-4 mt-2 border-t border-black/10 dark:border-white/10 flex justify-center"
                                onClick={() => setIsOpen(false)}
                            >
                                <AuthButton />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}