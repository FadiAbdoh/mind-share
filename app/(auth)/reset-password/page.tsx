"use client"
import { useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

type StatusType = {
    error: string | null
    isSuccess: boolean,
    isLoading: boolean,
}

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\-\.])[A-Za-z\d@$!%*?&#_\-\.]{8,}$/;

    const [password, setPassword] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        showNewPassword: false,
        showConfirmPassword: false,
    });
    const [status, setStatus] = useState<StatusType>({
        error: null,
        isSuccess: false,
        isLoading: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus((prev) => ({
            ...prev,
            error: ''
        }));

        if(!token) {
            setStatus((prev) => ({
                ...prev,
                error: "Invalid or missing reset token.",
            }));
            return;
        }

        if(password.newPassword !== password.confirmPassword) {
            setStatus((prev) => ({
                ...prev,
                error: 'Passwords Do NOT match.',
            }))
            return;
        }

        if(!strongPasswordRegex.test(password.newPassword)) {
            setStatus((prev) => ({
                ...prev, 
                error: "The password must be at least 8 characters long, and contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&#)."
            }));
            return
        }

        setStatus((prev) => ({
            ...prev,
            isLoading: true,
        }));

        try {
            const newPassword = password.newPassword;
            const res = await fetch('/api/auth/reset-password', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await res.json();

            if(!res.ok) {
                setStatus((prev) => ({
                    ...prev,
                    error: data.message || "Failed to reset password (in reset.tsx)."
                }))
                return
            }

            setStatus((prev) => ({
                ...prev,
                isSuccess: true,
            }));

        } catch(e) {
            setStatus((prev) => ({
                ...prev,
                error: 'An unexpected error occurred (in resetPass.tsx). Please try again.',
            }));
        } finally {
            setStatus((prev) => ({
                ...prev,
                isLoading: true,
            }));
        }
    }

    if(status.isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-4"
            >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Password Reset
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
                        Your password has been successfully updated.
                    </p>
                </div>
                <div className="pt-4">
                    <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5 px-4 rounded-xl min-h-[44px] transition-all duration-200"
                    >
                        Go to Login
                    </Link>
                </div>
            </motion.div>
        );
    }

    if (!token) {
        return (
            <div className="text-center space-y-4 py-4">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                    Invalid or missing password reset token. Please request a new link.
                </div>
                <Link
                    href="/forgot-password"
                    className="inline-flex text-sm text-brand-primary font-semibold hover:underline"
                >
                    Request new link
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="text-center space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Set New Password
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
                    Please enter your new password below.
                </p>
            </div>

            {status.error && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center"
                >
                    {status.error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                {/* new password */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
                        New Password
                    </label>
                    <div className="relative flex items-center">
                        <Lock className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
                        <input
                            type={showPassword.showNewPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={password.newPassword}
                            onChange={(e) => setPassword((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                            }))}
                            className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => ({
                                ...prev,
                                showNewPassword: !prev.showNewPassword,
                            }))}
                            className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword.showNewPassword ? 
                                <EyeOff className="w-4 h-4" /> 
                                : <Eye className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </div>

                {/* confirm password*/}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
                        Confirm Password
                    </label>
                    <div className="relative flex items-center">
                        <Lock className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
                        <input
                            type={showPassword.showConfirmPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={password.confirmPassword}
                            onChange={(e) => setPassword((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                            }))}
                            className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => ({
                                ...prev,
                                showConfirmPassword: !prev.showConfirmPassword,
                            }))}
                            className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword.showConfirmPassword ? 
                                <EyeOff className="w-4 h-4" /> 
                                : <Eye className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={status.isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5 px-4 rounded-xl min-h-[44px] mt-2 disabled:opacity-60"
                >
                    {status.isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <span>Reset Password</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
            </form>
        </>
    )

}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-[55vh] md:min-h-[85vh] flex items-center justify-center container mx-auto py-6 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 shadow-xl backdrop-blur-md space-y-6"
            >
                <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    );
}