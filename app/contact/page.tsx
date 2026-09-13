"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, HelpCircle, Loader2, Mail, Send, Sparkles, User } from "lucide-react";
import React, { useState } from "react";


export default function ContactPage() {

    const { data: session, status } = useSession();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "general",
        message: "",
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const [isLoading, setIsLoading] = useState(false);
    const [pageStatus, setPageStatus] = useState<{
        type: "success" | "error" | null;
        message: string | null;
    }>({
        type: null,
        message: null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPageStatus({ type: null, message: null });
        setIsLoading(true);

        try {

            const res = await fetch('/api/contact', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send your message.");
            }

            setPageStatus({
                type: "success",
                message:
                    "Thank you! Your message has been sent successfully. We'll be in touch soon.",
            });

            setFormData((prev) => ({
                ...prev,
                subject: 'general',
                message: '',
            }))

        } catch (e: any) {
            setPageStatus({
                type: 'error',
                message: e.message || 'Something went wrong. Please try again later.',
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 px-1 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-2xl mx-auto space-y-3 mb-12"
            >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Get In Touch
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    We&apos;d love to hear from you
                </h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400">
                    Have a suggestion, want to write with us, or encountered an issue? Drop
                    us a message and our team will get back to you.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* left col */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="lg:col-span-5 space-y-6"
                >
                    <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 shadow-lg backdrop-blur-md space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Contact Information
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">
                            Feel free to reach out through the form or directly via email for
                            general inquiries and collaborations.
                        </p>
                        <div className="pt-2 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
                                        Direct Email
                                    </p>
                                    <p className="font-semibold text-gray-800 dark:text-neutral-200 text-xs sm:text-sm">
                                        support@mindshare.com
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-neutral-300">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
                                        Response Window
                                    </p>
                                    <p className="font-semibold text-gray-800 dark:text-neutral-200 text-xs sm:text-sm">
                                        Usually within 24 to 48 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 shadow-lg backdrop-blur-md space-y-3">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
                            <HelpCircle className="w-4 h-4 text-brand-primary" />
                            <span>Quick Tips</span>
                        </div>
                        <ul className="text-xs text-gray-500 dark:text-neutral-400 space-y-3 leading-relaxed">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                                <span>
                                    Looking to share your thoughts? Head over to{" "}
                                    <a 
                                    href={status === 'authenticated' ? '/writePost' : '/login?callbackUrl=/writePost'} 
                                    className="text-brand-primary font-medium hover:underline">
                                        Write Post
                                    </a>{" "}
                                    to publish your story directly.
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                                <span>
                                    Need to change your profile picture or bio? Manage it in{" "}
                                    <a 
                                    href={status === 'authenticated' ? '/profile/edit' : '/login?callbackUrl=/writePost'}
                                    className="text-brand-primary font-medium hover:underline">
                                        Edit Profile
                                    </a>.
                                </span>
                            </li>                        
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                                <span>
                                    Found a technical issue? Please specify the page URL and browser to help us fix it quickly.
                                </span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
                {/* right col */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="lg:col-span-7"
                >
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-gray-200/80 dark:border-neutral-800 shadow-xl backdrop-blur-md space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Send a Message
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-1">
                                Fill out the form below and we will get back to you as soon as
                                possible.
                            </p>
                        </div>
                        {pageStatus.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-3 ${pageStatus.type === "success"
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                                    }`}
                            >
                                {pageStatus.type === "success" ? (
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                )}
                                <span>{pageStatus.message}</span>
                            </motion.div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* name */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="name"
                                        className="text-xs font-semibold text-gray-700 dark:text-neutral-300"
                                    >
                                        Your Name
                                    </label>
                                    <div className="relative flex items-center">
                                        <User className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Your Name"
                                            value={status === "authenticated" ? session?.user?.name || "" : formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px] transition-all"
                                        />
                                    </div>
                                </div>
                                {/* email */}
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="email"
                                        className="text-xs font-semibold text-gray-700 dark:text-neutral-300"
                                    >
                                        Your Email
                                    </label>
                                    <div className="relative flex items-center">
                                        <Mail className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            value={status === "authenticated" ? session?.user?.email || "" : formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* subject */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="subject"
                                    className="text-xs font-semibold text-gray-700 dark:text-neutral-300"
                                >
                                    Topic / Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px] transition-all cursor-pointer dark:bg-neutral-900"
                                >
                                    <option value="general" className="dark:bg-neutral-900 text-gray-900 dark:text-white">
                                        General Inquiry
                                    </option>
                                    <option value="feedback" className="dark:bg-neutral-900 text-gray-900 dark:text-white">
                                        Feedback & Suggestions
                                    </option>
                                    <option value="writer" className="dark:bg-neutral-900 text-gray-900 dark:text-white">
                                        Write with Us / Guest Post
                                    </option>
                                    <option value="issue" className="dark:bg-neutral-900 text-gray-900 dark:text-white">
                                        Technical Bug / Issue
                                    </option>
                                    <option value="business" className="dark:bg-neutral-900 text-gray-900 dark:text-white">
                                        Partnership & Business
                                    </option>
                                </select>
                            </div>
                            {/* message */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="message"
                                    className="text-xs font-semibold text-gray-700 dark:text-neutral-300"
                                >
                                    Message
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        placeholder="Tell us what's on your mind..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-transparent text-gray-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                                    />
                                    <div className="text-right text-[11px] text-gray-400 dark:text-neutral-500 pt-1">
                                        {formData.message.length} characters
                                    </div>
                                </div>
                            </div>
                            {/* submit btn */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 px-4 rounded-xl min-h-[46px] shadow-sm hover:shadow-md hover:shadow-brand-primary/20 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Sending your message...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}