
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })
            // (Delay)
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || "Failed to send reset email");
                return;
            }

            setIsSubmitted(true);
        } catch (err) {
            setError("Failed to send reset email. Please try again. (page)");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[55vh] md:min-h-[85vh] flex items-center justify-center container mx-auto py-6 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 shadow-xl dark:shadow-2xl dark:shadow-black/50 backdrop-blur-md space-y-6"
            >
                {isSubmitted ? (
                    // ✅ شاشة تأكيد إرسال رابط التعيين
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4 py-4"
                    >
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Check your email
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
                                We sent a password reset link to <br />
                                <span className="font-semibold text-gray-800 dark:text-neutral-200">{email}</span>
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-brand-primary hover:underline underline-offset-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to login</span>
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    // 📝 نموذج إدخال البريد الإلكتروني
                    <>
                        <div className="text-center space-y-1.5">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Reset Password
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="email"
                                    className="text-xs font-semibold text-gray-700 dark:text-neutral-300"
                                >
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className="w-4 h-4 absolute left-3.5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="new-password"
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 min-h-[44px]"
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5 px-4 rounded-xl min-h-[44px] shadow-sm hover:shadow-md hover:shadow-brand-primary/20 transition-all duration-200 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Sending link...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-1.5 text-xs text-brand-primary font-semibold hover:underline underline-offset-4"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Return to Login</span>
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}