"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false
            })
            if(response?.error) {
                setError('Invalid Email Or Password');
                setIsLoading(false);
                return
            }
            router.push('/');
            router.refresh();
        } catch(e) {
            setError('An unexpected error occurred, please try again later.');
            setIsLoading(false);
        }

    };

    return (
        <div className="min-h-[55vh] md:min-h-[85vh] flex items-center justify-center container mx-auto py-2 py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gray-50/80 dark:bg-neutral-900/60 border border-gray-100 dark:border-neutral-800 shadow-xl backdrop-blur-xs space-y-6"
            >
                {/* الهيدر العلوي */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-text-soft">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* أزرار التسجيل عبر السوشيال ميديا */}
                <div className="grid grid-cols-1">
                    <button
                        onClick={() => signIn('github')}
                        type="button"
                        aria-label="Sign in with GitHub"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 text-text-main font-medium text-sm transition-colors duration-200 min-h-[44px] cursor-pointer"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>GitHub</span>
                    </button>
                </div>

                {/* فاصل ذكي */}
                <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 dark:border-neutral-800 w-full" />
                    <span className="bg-gray-50 dark:bg-neutral-900 px-3 text-xs text-text-soft uppercase tracking-wider absolute font-medium">
                        Or continue with
                    </span>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* نموذج الإدخال (Form) */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* حقل البريد الإلكتروني */}
                    <div className="space-y-1">
                        <label
                            htmlFor="email"
                            className="text-xs font-semibold text-text-main"
                        >
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-5 h-5 absolute left-3.5 text-text-soft pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 min-h-[44px]"
                            />
                        </div>
                    </div>

                    {/* حقل كلمة المرور */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-xs font-semibold text-text-main"
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-brand-primary hover:underline underline-offset-4"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="w-5 h-5 absolute left-3.5 text-text-soft pointer-events-none" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 min-h-[44px]"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-text-soft hover:text-text-main transition-colors duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* زر إرسال النموذج */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-medium py-3 px-4 rounded-xl min-h-[44px] shadow-sm transition-colors duration-200 cursor-pointer mt-2"
                    >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )
                        }
                    </motion.button>
                </form>

                {/* رابط إنشاء حساب جديد */}
                <p className="text-center text-xs text-text-soft pt-2">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-brand-primary font-semibold hover:underline underline-offset-4 min-h-[44px] inline-flex items-center"
                    >
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}



